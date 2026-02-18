import prisma from '../lib/prisma.js';

// Listar todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      include: {
        _count: { select: { usuarios: true } }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  try {
    const { nombre, permisos } = req.body;
    const nuevoRol = await prisma.rol.create({
      data: {
        nombre: nombre.toUpperCase(),
        permisos: permisos || {}
      }
    });
    res.status(201).json(nuevoRol);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol. El nombre podría estar duplicado.' });
  }
};

// Actualizar un rol (incluyendo sus permisos)
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, permisos } = req.body;

    // Evitar editar roles protegidos por el sistema
    const rol = await prisma.rol.findUnique({ where: { id: parseInt(id) } });
    if (rol.isProtected) {
      return res.status(400).json({ message: 'No se puede editar un rol protegido por el sistema.' });
    }

    const rolActualizado = await prisma.rol.update({
      where: { id: parseInt(id) },
      data: {
        nombre: nombre ? nombre.toUpperCase() : undefined,
        permisos: permisos // Aquí es donde el admin cambia los true/false
      }
    });

    res.json(rolActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol.' });
  }
};

// Borrar un rol
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Evitar borrar roles protegidos por el sistema
    const rol = await prisma.rol.findUnique({ where: { id: parseInt(id) } });
    if (rol.isProtected) {
      return res.status(400).json({ message: 'No se puede eliminar un rol protegido por el sistema.' });
    }

    await prisma.rol.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Rol eliminado con éxito.' });
  } catch (error) {
    res.status(400).json({ message: 'No se puede eliminar un rol que tiene usuarios asignados.' });
  }
};
