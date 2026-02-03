import express from 'express';
import { body } from 'express-validator';
import * as companyController from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompany);

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('website').optional().isURL(),
    validate,
  ],
  companyController.createCompany
);

router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
