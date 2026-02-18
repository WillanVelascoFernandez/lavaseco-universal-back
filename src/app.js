import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import lavadoraRoutes from './routes/lavadora.routes.js';
import secadoraRoutes from './routes/secadora.routes.js';
import sucursalRoutes from './routes/sucursal.routes.js';
import './lib/mqtt.js';

const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/lavadoras', lavadoraRoutes);
app.use('/api/secadoras', secadoraRoutes);
app.use('/api/sucursales', sucursalRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: "¡Bienvenido a la API de Lavaseco Universal!",
    status: "Servidor funcionando correctamente"
  });
});

export default app;
