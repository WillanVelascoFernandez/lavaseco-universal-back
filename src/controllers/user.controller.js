import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        branches: {
          include: { branch: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      active: user.active,
      role: user.role,
      branches: user.branches.map(b => b.branch)
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, active, roleId, branchIds, password } = req.body;

    let updateData = {
      email,
      name,
      active,
      roleId: roleId ? parseInt(roleId) : undefined
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        branches: branchIds ? {
          deleteMany: {},
          create: branchIds.map(bid => ({ branchId: bid }))
        } : undefined
      },
      include: {
        role: true,
        branches: { include: { branch: true } }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own user.' });
    }

    await prisma.userBranch.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.user.delete({ where: { id: parseInt(id) } });
    
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
