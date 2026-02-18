import prisma from '../lib/prisma.js';
import { publishMessage } from '../lib/mqtt.js';

export const getLavadoras = async (req, res) => {
  try {
    const lavadoras = await prisma.lavadora.findMany({
      include: { sucursal: true },
      orderBy: { id: 'asc' }
    });
    res.json(lavadoras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lavadoras' });
  }
};

export const createLavadora = async (req, res) => {
  try {
    const { sucursalId } = req.body;
    const nuevaLavadora = await prisma.lavadora.create({
      data: { sucursalId: parseInt(sucursalId) }
    });
    res.status(201).json(nuevaLavadora);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear lavadora' });
  }
};

export const toggleLavadora = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lavadora = await prisma.lavadora.findUnique({
      where: { id: parseInt(id) }
    });

    if (!lavadora) {
      return res.status(404).json({ message: 'Lavadora no encontrada' });
    }

    const lavadoraActualizada = await prisma.lavadora.update({
      where: { id: parseInt(id) },
      data: { isEnable: !lavadora.isEnable }
    });

    publishMessage(`lavadoras/${id}/status`, {
      type: 'washer',
      id: lavadoraActualizada.id,
      isEnable: lavadoraActualizada.isEnable,
      updatedAt: lavadoraActualizada.updatedAt
    });

    res.json({
      message: `Lavadora ${lavadoraActualizada.isEnable ? 'habilitada' : 'deshabilitada'} con éxito`,
      lavadora: lavadoraActualizada
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado de la lavadora' });
  }
};
