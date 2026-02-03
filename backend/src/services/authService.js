import models from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import redisClient from '../config/redis.js';

const { User } = models;

export const registerUser = async (userData) => {
  const { email, password, firstName, lastName, role = 'sales' } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw { statusCode: 409, message: 'User already exists' };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token
  await user.update({ refreshToken });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  // Check if user is active
  if (!user.isActive) {
    throw { statusCode: 403, message: 'Account is disabled' };
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Save refresh token and last login
  await user.update({ 
    refreshToken,
    lastLogin: new Date(),
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw { statusCode: 401, message: 'Invalid refresh token' };
  }

  // Find user
  const user = await User.findByPk(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) {
    throw { statusCode: 401, message: 'Invalid refresh token' };
  }

  // Generate new access token
  const accessToken = generateAccessToken(user.id, user.email, user.role);

  return { accessToken };
};

export const logoutUser = async (userId, accessToken) => {
  // Clear refresh token
  await User.update(
    { refreshToken: null },
    { where: { id: userId } }
  );

  // Blacklist current access token (only if Redis is available)
  if (accessToken && redisClient.isOpen) {
    try {
      await redisClient.setEx(
        `blacklist:${accessToken}`,
        900, // 15 minutes (token expiry)
        'blacklisted'
      );
    } catch (redisError) {
      console.warn('Failed to blacklist token in Redis:', redisError.message);
    }
  }

  return { message: 'Logged out successfully' };
};

export const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'refreshToken'] },
  });

  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  // Don't allow updating sensitive fields directly
  delete updateData.password;
  delete updateData.email;
  delete updateData.role;
  delete updateData.refreshToken;

  await user.update(updateData);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Current password is incorrect' };
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword);
  await user.update({ password: hashedPassword });

  return { message: 'Password updated successfully' };
};
