import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

/**
 * Middleware to validate that the user is authenticated via JWT
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
    
    // We search for the user to ensure it still exists and bring their current role
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { 
        role: true,
        branches: { include: { branch: true } }
      }
    });

    if (!user || !user.active) {
      return res.status(403).json({ message: 'User not found or inactive.' });
    }

    // Update last activity in the background
    prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    }).catch(err => console.error('Error updating last activity:', err));

    // Attach the full user to the request
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Middleware to validate that the user has a specific permission
 * @param {string} permission - Permission name (e.g.: 'manage_users')
 */
export const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(500).json({ message: 'Server error. Role not identified.' });
    }

    const permissions = req.user.role.permissions || {};

    if (permissions[permission]) {
      return next();
    }

    return res.status(403).json({ 
      message: `You do not have sufficient permissions to perform this action (${permission}).` 
    });
  };
};
