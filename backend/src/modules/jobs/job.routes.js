import express from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { authorize, role } from '../../middlewares/role.middleware.js';
import * as jobController from './job.controller.js';

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
    jobController.createJob
);

/**
 * @route   GET /api/v1/jobs/my-jobs
 * @desc    Get jobs created by current client OR assigned to current handyman
 * @access  Private (Client or Handyman)
 */
router.get(
    "/my-jobs",
    authenticate,
    role.user(),
    jobController.getMyJobs
);

// ===============================================
// JOB DISCOVERY ROUTES
// ===============================================

/**
 * @route   GET /api/v1/jobs
 * @desc    Get all jobs (with role checks in service)
 * @access  Private (Client/Handyman/Admin with proper permissions)
 */
router.get(
    "/",
    authenticate,
    role.user(),
    jobController.getAllJobs
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
    jobController.getAvailableJobs
);

// ===============================================
// SINGLE JOB OPERATIONS
// ===============================================

/**
 * @route   GET /api/v1/jobs/:jobId
 * @desc    Get job by ID (Access control in service layer)
 * @access  Private (Client/Handyman/Admin with proper permissions)
 */
router.get(
    "/:jobId",
    authenticate,
    role.user(),
    jobController.getJobById
);

/**
 * @route   PATCH /api/v1/jobs/:jobId
 * @desc    Update job (Only client can update their pending jobs)
 * @access  Private (Client)
 */
router.patch(
    "/:jobId",
    authenticate,
    authorize("client"),
    jobController.updateJob             // implemented for general updates
);

// ===============================================
// JOB LIFECYCLE ACTIONS
// ===============================================

/**
 * @route   POST /api/v1/jobs/:jobId/accept
 * @desc    Accept a job (Handyman only)
 * @access  Private (Handyman)
 */
router.post(
    "/:jobId/accept",
    authenticate,
    authorize("handyman"),
    jobController.acceptJob
);

/**
 * @route   POST /api/v1/jobs/:jobId/start
 * @desc    Start a job (Handyman only)
 * @access  Private (Handyman)
 */
router.post(
    "/:jobId/start",
    authenticate,
    authorize("handyman"),
    jobController.startJob
);

/**
 * @route   POST /api/v1/jobs/:jobId/complete
 * @desc    Mark job as completed (Handyman)
 * @access  Private
 */
router.post(
    "/:jobId/complete",
    authenticate,
    authorize("handyman"),
    jobController.completeJob
);

/**
 * @route   DELETE /api/v1/jobs/:jobId
 * @desc    Delete a job (Client can delete pending jobs)
 * @access  Private
 */
router.delete(
    "/:jobId",
    authenticate,
    authorize("client"),
    jobController.deleteJob
);

// ===============================================
// FUTURE ROUTES (Commented for now)
// ===============================================

/**
 * @route   POST /api/v1/jobs/:jobId/review
 * @desc    Leave a review for completed job
 * @access  Private (Client or Handyman who was part of the job)
 */
router.post(
    "/:jobId/review",
    authenticate,
    role.user,
    jobController.addReview
);

export default router;