import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from './logger.js';

// User schema
const userSchema = new mongoose.Schema({
  providerId: { type: String, required: true },
  provider: { type: String, required: true },
  email: { type: String },
  username: { type: String },
  name: { type: String, required: true },
  picture: { type: String },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index for provider + providerId (only unique constraint needed)
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.success('Connected to MongoDB');
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Save or update user
export const saveUser = async (profile) => {
  try {
    const user = await User.findOneAndUpdate(
      { provider: profile.provider, providerId: profile.id },
      {
        email: profile.email || null,
        username: profile.username || profile.login || null,
        name: profile.name || profile.display_name || profile.username || profile.login || 'Unknown User',
        picture: profile.picture || profile.avatar_url || profile.profile_image_url || null,
        emailVerified: profile.email_verified || false,
        lastLogin: new Date()
      },
      { upsert: true, new: true }
    );
    logger.info(`User saved to database: ${profile.email || profile.username} via ${profile.provider}`);
    return user;
  } catch (error) {
    logger.error(`Failed to save user: ${error.message}`);
    throw error;
  }
};