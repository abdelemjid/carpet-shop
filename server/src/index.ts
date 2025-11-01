import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth/auth.route';
import productRoute from './routes/user/product.route';
import userRoute from './routes/admin/user.route';
import orderRoute from './routes/user/order.route';
import adminOrderRoute from './routes/admin/order.route';
import statsRoute from './routes/admin/stats.route';
import cartRoute from './routes/user/cart.route';

dotenv.config();

const app = express();
const clientUrl = process.env.CLIENT_URL;
const adminUrl = process.env.ADMIN_URL;
const mongodbString = process.env.MONGODB_CONNECTION_URI;
const cloudinaryName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;
const port = process.env.PORT || 5000;

if (!mongodbString) throw new Error('[-] There is no MongoDB connection URI on Env variable!');
if (!clientUrl) throw new Error('[-] There is no Client URL on Env variables!');
if (!adminUrl) throw new Error('[-] There is no Admin URL on Env variables!');
if (!cloudinaryName)
  throw new Error("[-] There is no Cloudinary's Cloud name URL on Env variables!");
if (!cloudinaryKey) throw new Error("[-] There is no Cloudinary's Cloud Key URL on Env variables!");
if (!cloudinarySecret)
  throw new Error("[-] There is no Cloudinary's Cloud Secret URL on Env variables!");

// Connect the MongoDB
mongoose
  .connect(mongodbString as string)
  .then(() => {
    console.log('[+] MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('Error mongodb connection:', error);
  });

// Cloudinary initialization
cloudinary.config({
  cloud_name: cloudinaryName as string,
  api_key: cloudinaryKey as string,
  api_secret: cloudinarySecret as string,
});

app.use(
  cors({
    origin: [clientUrl as string, adminUrl as string],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
// admin routes
app.use('/api/admin/users', userRoute);
app.use('/api/admin/products', productRoute);
app.use('/api/admin/orders', adminOrderRoute);
app.use('/api/admin/stats', statsRoute);

app.listen(port, () => {
  console.log(`[+] The app is running on port ${port}`);
});
