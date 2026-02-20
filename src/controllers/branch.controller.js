import prisma from '../lib/prisma.js';

export const getBranches = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role.isProtected;
    const branchIds = req.user.branches.map(b => b.branchId);
    
    const branches = await prisma.branch.findMany({
      where: isSuperAdmin ? {} : {
        id: { in: branchIds }
      },
      include: {
        _count: {
          select: { washers: true, dryers: true, users: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.json(branches);
  } catch (error) {
    console.error('Error in getBranches:', error);
    res.status(500).json({ message: 'Error retrieving branches' });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const newBranch = await prisma.branch.create({
      data: { name, address, phone }
    });

    // Automatically assign this new branch to all users with a protected role (e.g., SUPERADMIN)
    const protectedRoles = await prisma.role.findMany({
      where: { isProtected: true }
    });
    
    const protectedRoleIds = protectedRoles.map(r => r.id);
    
    const usersToUpdate = await prisma.user.findMany({
      where: { roleId: { in: protectedRoleIds } }
    });

    if (usersToUpdate.length > 0) {
      await prisma.userBranch.createMany({
        data: usersToUpdate.map(u => ({
          userId: u.id,
          branchId: newBranch.id
        }))
      });
    }

    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ message: 'Error creating branch' });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.branch.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting branch' });
  }
};
