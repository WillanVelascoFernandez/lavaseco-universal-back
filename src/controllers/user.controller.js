import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role.isProtected;
    const assignedBranchIds = req.user.branches.map(b => b.branchId);

    const users = await prisma.user.findMany({
      where: isSuperAdmin ? {} : {
        branches: {
          some: {
            branchId: { in: assignedBranchIds }
          }
        }
      },
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
      isEnabled: user.isEnabled,
      role: user.role,
      lastActive: user.lastActive,
      branches: user.branches.map(b => b.branch)
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, isEnabled, roleId, branchIds, password } = req.body;

    const userToUpdate = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { role: true }
    });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isTargetProtected = userToUpdate.role.isProtected;

    let updateData = {
      email,
      name,
      isEnabled: isTargetProtected ? userToUpdate.isEnabled : isEnabled,
      roleId: (roleId && !isTargetProtected) ? parseInt(roleId) : userToUpdate.roleId
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        branches: (branchIds && !isTargetProtected) ? {
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

    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { role: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToDelete.role.isProtected) {
      return res.status(403).json({ message: 'Cannot delete a system-protected user.' });
    }

    await prisma.userBranch.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.user.delete({ where: { id: parseInt(id) } });
    
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
