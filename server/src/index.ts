import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import userRoutes from './routes/user.route';

dotenv.config();

if (!process.env.MONGODB_CONNECTION_URI)
  throw new Error('[-] There is not MongoDB connection URI on environment variable!!!');

// Connect the MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_URI as string)
  .then(() => {
    console.log('[+] MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('Error mongodb connection:', error);
  });

const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL as string, process.env.ADMIN_URL as string],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', userRoutes);
//app.use('/api/orders');

app.listen(port, () => {
  console.log(`[+] The app is running on port ${port}`);
});
