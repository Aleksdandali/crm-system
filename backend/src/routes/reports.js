import express from 'express';
import { body } from 'express-validator';
import * as reportController from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', reportController.getDashboard);
router.get('/sales-funnel', reportController.getSalesFunnel);
router.get('/performance', reportController.getPerformanceReport);

router.post('/custom', reportController.getCustomReport);

router.get('/', reportController.getUserReports);

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('type').isIn(['dashboard', 'sales', 'contacts', 'custom']),
    body('configuration').isObject(),
    validate,
  ],
  reportController.saveReport
);

router.delete('/:id', reportController.deleteReport);

export default router;
