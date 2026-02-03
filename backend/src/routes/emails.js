import express from 'express';
import { body } from 'express-validator';
import * as emailController from '../controllers/emailController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', emailController.getEmails);
router.get('/:id', emailController.getEmail);

router.post(
  '/send',
  [
    body('to').notEmpty(),
    body('subject').notEmpty().trim(),
    body('body').notEmpty(),
    body('contactId').optional().isUUID(),
    validate,
  ],
  emailController.sendEmail
);

router.delete('/:id', emailController.deleteEmail);

export default router;
