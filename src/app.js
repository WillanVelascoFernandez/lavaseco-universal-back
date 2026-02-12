import express from 'express';
import authRoutes from './routes/auth.routes.js';
import lavadoraRoutes from './routes/lavadora.routes.js';

const app = express();

// Middleware para que el servidor entienda JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/lavadoras', lavadoraRoutes);

// Una ruta de prueba para verificar que funciona
app.get('/', (req, res) => {
  res.json({
    message: "¡Bienvenido a la API de Lavaseco Universal!",
    status: "Servidor funcionando correctamente"
  });
});

export default app;
