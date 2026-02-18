import prisma from '../lib/prisma.js';
import { publishMessage } from '../lib/mqtt.js';

export const getDryers = async (req, res) => {
  try {
    const dryers = await prisma.dryer.findMany({
      include: { branch: true },
      orderBy: { id: 'asc' }
    });
    res.json(dryers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dryers' });
  }
};

export const createDryer = async (req, res) => {
  try {
    const { branchId } = req.body;
    const newDryer = await prisma.dryer.create({
      data: { branchId: parseInt(branchId) }
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
