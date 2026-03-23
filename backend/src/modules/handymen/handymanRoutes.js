import express from 'express';
import { authorize } from '../../middlewares/role.middleware.js';
import { authenticate } from '../auth/auth.middleware.js';
import {
    getHandymen,
    getHandymanById,
    createHandyman,
    updateHandyman,
    deleteHandyman,
    verifyHandyman,
    suspendHandyman,
    getHandymanStats,
    getAvailableHandymen
} from './handymanController.js'

const router = express.Router();

// Public routes (none for now)

// Protected routes - authentication required
router.use(authenticate);

// Routes accessible by authenticated users (handymen, admins)
router.get(
    '/', 
    authorize('admin'), 
    getHandymen
);

router.get(
    '/available',
    getAvailableHandymen
);


// Routes for specific handyman by ID
router.get(
    '/:id',
    authorize('admin'),
    getHandymanById
);

router.put(
    '/:id',
    authorize('admin'),
    updateHandyman
);

router.delete(
    '/:id',
    authorize('admin'),
    deleteHandyman
);

// Admin-only management routes
router.post(
    '/',
    authorize('admin'),
    createHandyman
);

router.post(
    '/:id/verify',
    authorize('admin'),
    verifyHandyman
);

router.post(
    '/:id/suspend',
    authorize('admin'),
    suspendHandyman
);

router.get(
    '/:id/stats',
    authorize('admin'),
    getHandymanStats
);

export default router;