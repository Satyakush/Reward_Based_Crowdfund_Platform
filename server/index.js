require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./middleware/errorMiddleware.js');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ message: 'Welcome to the Crowdfunding API!' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'crowdfund-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', uploadRoutes);
app.use('/api/payment-webhooks', require('./routes/paymentWebhookRoutes'));

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
