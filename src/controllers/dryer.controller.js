import prisma from '../lib/prisma.js';
import { publishMessage } from '../lib/mqtt.js';

export const getDryers = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role.isProtected;
    const branchIds = req.user.branches.map(b => b.branchId);

    const dryers = await prisma.dryer.findMany({
      where: isSuperAdmin ? {} : {
        branchId: { in: branchIds }
      },
      include: { 
        branch: true,
        _count: {
          select: { logs: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.json(dryers);
  } catch (error) {
    console.error('Error in getDryers:', error);
    res.status(500).json({ message: 'Error retrieving dryers' });
  }
};

export const createDryer = async (req, res) => {
  try {
    const { branchId, name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Machine name is required' });
    }

    const newDryer = await prisma.dryer.create({
      data: { 
        branchId: parseInt(branchId),
        name: name
      }
    });
    res.status(201).json(newDryer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating dryer' });
  }
};

export const toggleDryer = async (req, res) => {
  try {
    const { id } = req.params;
    const dryer = await prisma.dryer.findUnique({ where: { id: parseInt(id) } });

    if (!dryer) return res.status(404).json({ message: 'Dryer not found' });

    // Ownership check
    const isSuperAdmin = req.user.role.isProtected;
    const branchIds = req.user.branches.map(b => b.branchId);
    if (!isSuperAdmin && !branchIds.includes(dryer.branchId)) {
      return res.status(403).json({ message: 'You do not have access to this dryer.' });
    }

    const updatedDryer = await prisma.dryer.update({
      where: { id: parseInt(id) },
      data: { isEnabled: !dryer.isEnabled }
    });

    publishMessage(`dryers/${id}/status`, {
      type: 'dryer',
      id: updatedDryer.id,
      isEnabled: updatedDryer.isEnabled
    });

    res.json({
      message: `Dryer ${updatedDryer.isEnabled ? 'enabled' : 'disabled'} successfully`,
      dryer: updatedDryer
    });
  } catch (error) {
    res.status(500).json({ message: 'Error changing dryer state' });
  }
};
export const getDryerHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await prisma.dryerLog.findMany({
      where: { dryerId: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(logs);
  } catch (error) {
    console.error('Error in getDryerHistory:', error);
    res.status(500).json({ message: 'Error retrieving dryer history' });
  }
};
