import express from 'express';
import { authorize } from '../../middlewares/role.middleware.js';
import { authenticate } from '../auth/auth.middleware.js';
import * as customerController from './customerController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Customer management routes (admin only)
router.get(
    '/',
    authorize('admin'),
    customerController.getCustomers
);

router.post(
    '/',
    authorize('admin'),
    customerController.createCustomer
);

// Customer by ID routes (admin only)
router.get(
    '/:id',
    authorize('admin'),
    customerController.getCustomerById
);

router.put(
    '/:id',
    authorize('admin'),
    customerController.updateCustomer
);

router.delete(
    '/:id',
    authorize('admin'),
    customerController.deleteCustomer
);

// Customer actions (admin only)
router.post(
    '/:id/suspend',
    authorize('admin'),
    customerController.suspendCustomer
);

router.post(
    '/:id/activate',
    authorize('admin'),
    customerController.activateCustomer
);

// Customer data routes (admin only)
router.get(
    '/:id/stats',
    authorize('admin'),
    customerController.getCustomerStats
);

router.get(
    '/:id/jobs',
    authorize('admin'),
    customerController.getCustomerJobs
);

export default router;