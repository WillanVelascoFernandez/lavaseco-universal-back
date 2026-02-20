import prisma from '../lib/prisma.js';

export const getBranches = async (req, res) => {
  try {
    const branchIds = req.user.branches.map(b => b.branchId);
    
    const branches = await prisma.branch.findMany({
      where: {
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
