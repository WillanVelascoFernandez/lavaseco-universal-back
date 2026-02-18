import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      include: {
        rol: true,
        sucursales: {
          include: { sucursal: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    
    // Formateamos la respuesta para que sea más fácil de leer por el frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      activo: user.activo,
      rol: user.rol,
      sucursales: user.sucursales.map(s => s.sucursal)
    }));

    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, activo, rolId, sucursalIds, password } = req.body;

    // Si se envía un password, lo encriptamos
    let updateData = {
      email,
      nombre,
      activo,
      rolId: rolId ? parseInt(rolId) : undefined
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        // Actualizar sucursales: Primero borramos las actuales y creamos las nuevas
        sucursales: sucursalIds ? {
          deleteMany: {},
          create: sucursalIds.map(sid => ({ sucursalId: sid }))
        } : undefined
      },
      include: {
        rol: true,
        sucursales: { include: { sucursal: true } }
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir que el admin se borre a sí mismo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario.' });
    }

    // Primero borramos sus relaciones con sucursales (por la integridad referencial)
    await prisma.usuarioSucursal.deleteMany({ where: { usuarioId: parseInt(id) } });
    
    // Luego borramos el usuario
    await prisma.usuario.delete({ where: { id: parseInt(id) } });
    
    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
