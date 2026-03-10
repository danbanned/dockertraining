// app/pages/api/health.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: 'disconnected'
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.database = 'connected';
    
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    healthcheck.database = 'error';
    res.status(503).json(healthcheck);
  }
}