import mongoose from 'mongoose';

// Job status enum - defines all possible states a job can be in
export const JobStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELED: "canceled"
};

// Service categories enum - expand this based on your platform's offerings
export const ServiceCategory = {
    PLUMBING: "plumbing",
    ELECTRICAL: "electrical",
    CARPENTRY: "carpentry",
    PAINTING: "painting",
    CLEANING: "cleaning",
    MOVING: "moving",
    GARDENING: "gardening",
    HVAC: "hvac",
    APPLIANCE_REPAIR: "appliance_repair",
    GENERAL_MAINTENANCE: "general_maintenance",
    OTHER: "other"
};