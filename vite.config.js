import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import express from 'express';
import emailRoutes from './server/routes/emailRoutes.js';
import { verifyTransporter } from './server/config/mailer.js';

// Load .env variables in Vite Node environment
dotenv.config();

function backendEmailPlugin() {
  const app = express();
  app.use(express.json());
  app.use('/api/notifications/email', emailRoutes);

  return {
    name: 'backend-email-plugin',
    configureServer(server) {
      // Mount Express application into Vite Connect middleware pipeline
      server.middlewares.use(app);

      // Verify connection on dev start
      verifyTransporter().catch(err => console.debug('SMTP Verify:', err.message));
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    backendEmailPlugin()
  ],
  server: {
    port: 5173
  }
});
