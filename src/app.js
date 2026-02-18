import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import washerRoutes from './routes/washer.routes.js';
import dryerRoutes from './routes/dryer.routes.js';
import roleRoutes from './routes/role.routes.js';
import userRoutes from './routes/user.routes.js';
import branchRoutes from './routes/branch.routes.js';
import reportRoutes from './routes/report.routes.js';
import './lib/mqtt.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/washers', washerRoutes);
app.use('/api/dryers', dryerRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/reports', reportRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Lavaseco Universal API is running' });
});

export default app;
