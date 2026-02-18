import prisma from '../lib/prisma.js';
import { publishMessage } from '../lib/mqtt.js';

export const getSecadoras = async (req, res) => {
  try {
    const secadoras = await prisma.secadora.findMany({
      include: { sucursal: true },
      orderBy: { id: 'asc' }
    });
    res.json(secadoras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener secadoras' });
  }
};

export const createSecadora = async (req, res) => {
  try {
    const { sucursalId } = req.body;
    const nueva = await prisma.secadora.create({
      data: { sucursalId: parseInt(sucursalId) }
    });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear secadora' });
  }
};

export const toggleSecadora = async (req, res) => {
  try {
    const { id } = req.params;
    const secadora = await prisma.secadora.findUnique({ where: { id: parseInt(id) } });

    if (!secadora) return res.status(404).json({ message: 'Secadora no encontrada' });

    const actualizada = await prisma.secadora.update({
      where: { id: parseInt(id) },
      data: { isEnable: !secadora.isEnable }
    });

    publishMessage(`secadoras/${id}/status`, {
      type: 'dryer',
      id: actualizada.id,
      isEnable: actualizada.isEnable
    });

    res.json({
      message: `Secadora ${actualizada.isEnable ? 'habilitada' : 'deshabilitada'}`,
      secadora: actualizada
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado' });
  }
};
