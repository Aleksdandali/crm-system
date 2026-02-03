import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('role').optional().isIn(['admin', 'manager', 'sales', 'viewer']),
    validate,
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate,
  ],
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty(),
    validate,
  ],
  authController.refresh
);

// Logout (protected)
router.post('/logout', authenticate, authController.logout);

// Get profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// Update profile (protected)
router.put(
  '/profile',
  authenticate,
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('phone').optional().trim(),
    validate,
  ],
  authController.updateProfile
);

// Change password (protected)
router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
    validate,
  ],
  authController.changePassword
);

export default router;
