import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Anti Gravity API Server',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Global Error Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Exception]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 ANTI GRAVITY SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log(`================================================================\n`);
});
