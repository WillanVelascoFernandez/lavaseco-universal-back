import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Obtener todas las lavadoras
router.get('/', async (req, res) => {
  try {
    const lavadoras = await prisma.lavadora.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(lavadoras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener lavadoras' });
  }
});

// Crear una nueva lavadora
router.post('/', async (req, res) => {
  try {
    const { sucursal } = req.body;
    const nuevaLavadora = await prisma.lavadora.create({
      data: { sucursal }
    });
    res.status(201).json(nuevaLavadora);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear lavadora' });
  }
});

// Habilitar / Deshabilitar lavadora
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primero buscamos la lavadora para saber su estado actual
    const lavadora = await prisma.lavadora.findUnique({
      where: { id: parseInt(id) }
    });

    if (!lavadora) {
      return res.status(404).json({ message: 'Lavadora no encontrada' });
    }

    // Cambiamos el estado al opuesto
    const lavadoraActualizada = await prisma.lavadora.update({
      where: { id: parseInt(id) },
      data: { isEnable: !lavadora.isEnable }
    });

    res.json({
      message: `Lavadora ${lavadoraActualizada.isEnable ? 'habilitada' : 'deshabilitada'} con éxito`,
      lavadora: lavadoraActualizada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar estado de la lavadora' });
  }
});

export default router;
