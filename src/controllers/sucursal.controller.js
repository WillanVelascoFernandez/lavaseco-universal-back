import prisma from '../lib/prisma.js';

export const getSucursales = async (req, res) => {
  try {
    const sucursales = await prisma.sucursal.findMany({
      include: {
        _count: {
          select: { lavadoras: true, secadoras: true, usuarios: true }
        }
      }
    });
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sucursales' });
  }
};

export const createSucursal = async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;
    const nueva = await prisma.sucursal.create({
      data: { nombre, direccion, telefono }
    });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear sucursal' });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sucursal.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Sucursal eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sucursal' });
  }
};
