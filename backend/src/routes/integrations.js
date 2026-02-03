import express from 'express';
import * as integrationController from '../controllers/integrationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all integrations (admin only)
router.get('/', authenticate, authorize('admin'), integrationController.getIntegrations);

// Update integration (admin only)
router.put('/:id', authenticate, authorize('admin'), integrationController.updateIntegration);

// Trigger manual sync (admin only)
router.post('/1c/sync', authenticate, authorize('admin'), integrationController.sync1C);
router.post('/shine-shop/sync', authenticate, authorize('admin'), integrationController.syncShineShop);

// Webhook endpoints (no auth - validated by webhook signature in production)
router.post('/1c/webhook', integrationController.handle1CWebhook);
router.post('/shine-shop/webhook', integrationController.handleShineShopWebhook);

export default router;
