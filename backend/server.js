const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const connectDB = require('./config/db');
const astrologerRoutes = require('./routes/astrologerRoutes');
const authRoutes = require('./routes/authRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { rateLimit } = require('./middleware/rateLimitMiddleware');
const { securityHeaders } = require('./middleware/securityMiddleware');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(securityHeaders);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ max: Number(process.env.RATE_LIMIT_MAX) || 300 }));
app.use('/api/auth/login', rateLimit({ max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20 }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/astrologers', astrologerRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Express API running on http://localhost:${port}`));
};

if (require.main === module) {
  start().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = app;
