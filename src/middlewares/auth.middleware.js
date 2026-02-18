import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

/**
 * Middleware para validar que el usuario está autenticado mediante JWT
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
    
    // Buscamos al usuario para asegurarnos de que sigue existiendo y traer su rol actual
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: { 
        rol: true,
        sucursales: { include: { sucursal: true } }
      }
    });

    if (!user || !user.activo) {
      return res.status(403).json({ message: 'Usuario no encontrado o inactivo.' });
    }

    // Adjuntamos el usuario completo a la petición
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware para validar que el usuario tiene un permiso específico
 * @param {string} permission - Nombre del permiso (ej: 'manage_users')
 */
export const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(500).json({ message: 'Error de servidor. Rol no identificado.' });
    }

    const permisos = req.user.rol.permisos || {};

    if (permisos[permission]) {
      return next();
    }

    return res.status(403).json({ 
      message: `No tienes permisos suficientes para realizar esta acción (${permission}).` 
    });
  };
};
