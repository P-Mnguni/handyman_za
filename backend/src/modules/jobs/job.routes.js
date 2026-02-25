import express from 'express';
import { authenticate } from '../auth/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import {
    createJob,
    getAllJobs,
    getJobById,
    acceptJob,
    completeJob,
    cancelJob,
    updateJobStatus,
    getMyJobs
} from './job.controller.js';

const router = express.Router();

/**
 * Job Routes
 * Base path: /api/v1/jobs
 */

// ===============================================
// CLIENT ROUTES (Job Creation & Management)
// ===============================================

/**
 * @route   POST /api/v1/jobs
 * @desc    Create a new job (Client only)
 * @access  Private (Client)
 */
router.post(
    "/",
    authenticate,
    authorize("client"),
    createJob
);

/**
 * @route   GET /api/v1/jobs/my-jobs
 * @desc    Get jobs created by current client OR assigned to current handyman
 * @access  Private (Client or Handyman)
 */
router.get(
    "/my-jobs",
    authenticate,
    getMyJobs
);