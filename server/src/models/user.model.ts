import mongoose, { Schema, Document } from 'mongoose';

export type Role = 'user' | 'admin';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<User>('User', userSchema);
