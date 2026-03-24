import express from 'express';
import { authorize } from '../../middlewares/role.middleware.js';
import { authenticate } from '../auth/auth.middleware.js';
import * as handymanController from './handymanController.js'

const router = express.Router();

// Public routes (none for now)

// Protected routes - authentication required
router.use(authenticate);

// Routes accessible by authenticated users (handymen, admins)
router.get(
    '/', 
    authorize('admin'), 
    handymanController.getHandymen
);

router.get(
    '/available',
    handymanController.getAvailableHandymen
);


// Routes for specific handyman by ID
router.get(
    '/:id',
    authorize('admin'),
    handymanController.getHandymanByID
);

router.put(
    '/:id',
    authorize('admin'),
    handymanController.updateHandyman
);

router.delete(
    '/:id',
    authorize('admin'),
    handymanController.deleteHandyman
);

// Admin-only management routes
router.post(
    '/',
    authorize('admin'),
    handymanController.createHandyman
);

router.post(
    '/:id/verify',
    authorize('admin'),
    handymanController.verifyHandyman
);

router.post(
    '/:id/suspend',
    authorize('admin'),
    handymanController.suspendHandyman
);

router.get(
    '/:id/stats',
    authorize('admin'),
    handymanController.getHandymanStats
);

export default router;