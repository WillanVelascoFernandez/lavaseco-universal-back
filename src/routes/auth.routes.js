import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const router = Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await prisma.usuario.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: 'ADMIN' // Por ahora el primero será ADMIN
      }
    });

    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: { id: newUser.id, email: newUser.email, nombre: newUser.nombre }
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

    // Buscar el usuario
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar el Token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'secret_key_123', // Usar variable de entorno
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el login' });
  }
});

export default router;
