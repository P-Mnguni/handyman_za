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

// ===============================================
// JOB DISCOVERY ROUTES
// ===============================================

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs (with filters - Handymen see available, Admins see all)
 * @access  Private (Handyman or Admin)
 */
router.get(
    "/",
    authenticate,
    authorize("handyman", "admin"),
    getAllJobs
);

/**
 * @route   GET /api/v1/jobs/available
 * @desc    Get only available (pending) jobs for handymen
 * @access  Private (Handymen)
 */
router.get(
    "/available",
    authenticate,
    authorize("handyman"),
    getAllJobs                  // Same controller but filters applied
);