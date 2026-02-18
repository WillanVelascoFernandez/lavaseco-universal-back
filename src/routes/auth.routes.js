import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const router = Router();

// Registro de usuario (Solo Admin debería poder registrar otros con roles específicos)
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, rolId, sucursalIds } = req.body;

    const userExists = await prisma.usuario.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rolId: rolId || 2, // Por defecto Operador si no se especifica
        sucursales: {
          create: sucursalIds ? sucursalIds.map(id => ({ sucursalId: id })) : []
        }
      },
      include: {
        rol: true,
        sucursales: { include: { sucursal: true } }
      }
    });

    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        rol: newUser.rol.nombre,
        sucursales: newUser.sucursales.map(s => s.sucursal.nombre)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: true,
        sucursales: {
          include: {
            sucursal: true
          }
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol.nombre },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol.nombre,
        permisos: user.rol.permisos,
        sucursales: user.sucursales.map(s => ({
          id: s.sucursal.id,
          nombre: s.sucursal.nombre
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login' });
  }
});

export default router;
