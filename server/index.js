import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';
import { verifyTransporter, OFFICIAL_SENDER, EMAIL_USER } from './config/mailer.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/notifications/email', emailRoutes);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'BloodLink Email Notification Microservice',
    sender: EMAIL_USER,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start Server & verify SMTP
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 [BloodLink Server] Running on http://localhost:${PORT}`);
  console.log(`📧 [BloodLink Sender] ${OFFICIAL_SENDER}`);
  console.log(`=======================================================`);
  
  // Verify SMTP Connection
  await verifyTransporter();
});

export default app;
