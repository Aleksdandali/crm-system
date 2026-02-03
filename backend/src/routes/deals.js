import express from 'express';
import { body } from 'express-validator';
import * as dealController from '../controllers/dealController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', dealController.getDeals);
router.get('/:id', dealController.getDeal);

router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('value').optional().isNumeric(),
    body('stage').optional().isIn(['qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost']),
    body('contactId').optional().isUUID(),
    body('companyId').optional().isUUID(),
    validate,
  ],
  dealController.createDeal
);

router.put('/:id', dealController.updateDeal);

router.patch(
  '/:id/stage',
  [
    body('stage').isIn(['qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost']),
    validate,
  ],
  dealController.updateDealStage
);

router.delete('/:id', dealController.deleteDeal);

export default router;
