import express from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
    createJob,
    getAllJobs,
    getJobById,
    acceptJob,
    completeJob,
    cancelJob,
    updateJobStatus,
    getMyJobs,
    addReview,
    uploadJobImages
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

// ===============================================
// SINGLE JOB OPERATIONS
// ===============================================

/**
 * @route   GET /api/v1/jobs/:id
 * @desc    Get job by ID (Access control in service layer)
 * @access  Private (Client/Handyman/Admin with proper permissions)
 */
router.get(
    "/:id",
    authenticate,
    getJobById
);

/**
 * @route   PATCH /api/v1/jobs/:id
 * @desc    Update job (Only client can update their pending jobs)
 * @access  Private (Client)
 */
router.patch(
    "/:id",
    authenticate,
    authorize("client"),
    updateJobStatus             // implemented for general updates
);

// ===============================================
// JOB LIFECYCLE ACTIONS
// ===============================================

/**
 * @route   PATCH /api/v1/jobs/:id/accept
 * @desc    Accept a job (Handyman only)
 * @access  Private (Handyman)
 */
router.patch(
    "/:id/accept",
    authenticate,
    authorize("handyman"),
    acceptJob
);

/**
 * @route   PATCH /api/v1/jobs/:id/complete
 * @desc    Mark job as completed (Client or Handyman, with service layer checks)
 * @access  Private
 */
router.patch(
    "/:id/complete",
    authenticate,
    completeJob
);

/**
 * @route   PATCH /api/v1/jobs/:id/cancel
 * @desc    Cancel a job (Client can cancel pending jobs, Handyman can cancel accepted jobs)
 * @access  Private
 */
router.patch(
    "/:id/cancel",
    authenticate,
    cancelJob
);

// ===============================================
// FUTURE ROUTES (Commented for now)
// ===============================================

/**
 * @route   POST /api/v1/jobs/:id/review
 * @desc    Leave a review for completed job
 * @access  Private (Client or Handyman who was part of the job)
 */
router.post(
    "/:id/review",
    authenticate,
    addReview
);

/**
 * @route   POST /api/v1/jobs/:id/upload
 * @desc    Upload images for a job
 * @access  Private (Client who created the job)
 */
router.post(
    "/:id/upload-images",
    authenticate,
    authorize("client"),
    uploadJobImages
);

export default router;