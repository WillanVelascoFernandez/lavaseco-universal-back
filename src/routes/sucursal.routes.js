import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Obtener todas las sucursales
router.get('/', async (req, res) => {
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
});

// Crear sucursal
router.post('/', async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;
    const nueva = await prisma.sucursal.create({
      data: { nombre, direccion, telefono }
    });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear sucursal' });
  }
});

// Eliminar sucursal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sucursal.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Sucursal eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sucursal' });
  }
});

export default router;
