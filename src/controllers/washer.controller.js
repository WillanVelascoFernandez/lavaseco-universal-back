import prisma from '../lib/prisma.js';
import { publishMessage } from '../lib/mqtt.js';

export const getWashers = async (req, res) => {
  try {
    const branchIds = req.user.branches.map(b => b.branchId);

    const washers = await prisma.washer.findMany({
      where: {
        branchId: { in: branchIds }
      },
      include: { branch: true },
      orderBy: { id: 'asc' }
    });
    res.json(washers);
  } catch (error) {
    console.error('Error in getWashers:', error);
    res.status(500).json({ message: 'Error retrieving washers' });
  }
};

export const createWasher = async (req, res) => {
  try {
    const { branchId, name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Machine name is required' });
    }

    const newWasher = await prisma.washer.create({
      data: { 
        branchId: parseInt(branchId),
        name: name
      }
    });
    res.status(201).json(newWasher);
  } catch (error) {
    res.status(500).json({ message: 'Error creating washer' });
  }
};

export const toggleWasher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const washer = await prisma.washer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!washer) {
      return res.status(404).json({ message: 'Washer not found' });
    }

    // Ownership check
    const branchIds = req.user.branches.map(b => b.branchId);
    if (!branchIds.includes(washer.branchId)) {
      return res.status(403).json({ message: 'You do not have access to this washer.' });
    }

    const updatedWasher = await prisma.washer.update({
      where: { id: parseInt(id) },
      data: { isEnabled: !washer.isEnabled }
    });

    publishMessage(`washers/${id}/status`, {
      type: 'washer',
      id: updatedWasher.id,
      isEnabled: updatedWasher.isEnabled,
      updatedAt: updatedWasher.updatedAt
    });

    res.json({
      message: `Washer ${updatedWasher.isEnabled ? 'enabled' : 'disabled'} successfully`,
      washer: updatedWasher
    });
  } catch (error) {
    res.status(500).json({ message: 'Error changing washer state' });
  }
};
