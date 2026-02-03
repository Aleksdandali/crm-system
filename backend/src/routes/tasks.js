import express from 'express';
import { body } from 'express-validator';
import * as taskController from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);

router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('dueDate').optional().isISO8601(),
    body('assigneeId').optional().isUUID(),
    validate,
  ],
  taskController.createTask
);

router.put('/:id', taskController.updateTask);
router.patch('/:id/complete', taskController.completeTask);
router.delete('/:id', taskController.deleteTask);

export default router;
