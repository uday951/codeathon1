import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { logger } from './logger.js';
import { connectDB } from './database.js';
import routes from './routes.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use('/', routes);

// Start server
app.listen(config.port, () => {
  logger.success(`Server running on http://localhost:${config.port}`);
  logger.info('OAuth Demo Backend Ready with unified-oauth');
});