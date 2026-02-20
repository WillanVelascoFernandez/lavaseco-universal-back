import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
  try {
    const { email, password, name, roleId, branchIds } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Security check: Do not allow creating users with protected roles (like SUPERADMIN)
    if (roleId) {
      const targetRole = await prisma.role.findUnique({ where: { id: parseInt(roleId) } });
      if (targetRole?.isProtected) {
        return res.status(403).json({ message: 'Cannot create additional system-protected users.' });
      }
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: roleId ? parseInt(roleId) : 2,
        branches: {
          create: branchIds ? branchIds.map(id => ({ branchId: id })) : []
        }
      },
      include: {
        role: true,
        branches: { include: { branch: true } }
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role.name,
        branches: newUser.branches.map(b => b.branch.name)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        branches: {
          include: {
            branch: true
          }
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isEnabled) {
      return res.status(403).json({ message: 'Su cuenta está desactivada. Por favor, contacte al administrador.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role.name },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    // Update last activity on successful login
    prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    }).catch(err => console.error('Error updating last activity on login:', err));

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: {
          name: user.role.name,
          isProtected: user.role.isProtected
        },
        permissions: user.role.permissions,
        branches: user.branches.map(b => ({
          id: b.branch.id,
          name: b.branch.name
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login error' });
  }
};
