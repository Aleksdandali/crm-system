import express from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all contacts
router.get('/', contactController.getContacts);

// Get contact by ID
router.get('/:id', contactController.getContact);

// Create contact
router.post(
  '/',
  [
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('companyId').optional().isUUID(),
    body('status').optional().isIn(['lead', 'prospect', 'customer', 'inactive']),
    validate,
  ],
  contactController.createContact
);

// Update contact
router.put(
  '/:id',
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('companyId').optional().isUUID(),
    body('status').optional().isIn(['lead', 'prospect', 'customer', 'inactive']),
    validate,
  ],
  contactController.updateContact
);

// Delete contact
router.delete('/:id', contactController.deleteContact);

export default router;
