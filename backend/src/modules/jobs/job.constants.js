// Job status enum - defines all possible states a job can be in
export const JobStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELED: "canceled"
};

export const JobPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
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

export const JobValidationMessage = {
    TITLE_REQUIRED: "Job title is required",
    TITLE_MIN_LENGTH: "Title must be at least 5 characters",
    TITLE_MAX_LENGTH: "Title cannot exceed 100 characters",
    DESCRIPTION_REQUIRED: "Description is required",
    DESCRIPTION_MIN_LENGTH: "Description must be at least 20 characters",
    DESCRIPTION_MAX_LENGTH: "Description cannot exceed 2000 characters",
    CATEGORY_REQUIRED: "Service category is required",
    CATEGORY_INVALID: "Please select a valid service category",
    IMAGE_INVALID: "Please provide valid image URLs",
    ADDRESS_REQUIRED: "Address is required",
    CITY_REQUIRED: "City is required",
    PROVINCE_REQUIRED: "Province is required",
    BUDGET_MIN_PRICE: "Budget cannot be negative",
    BUDGET_POSITIVE: "Budget must be greater than 0",
    CLIENT_REQUIRED: "Job must have a client",
    STATUS_INVALID: "Please select a valid job status",
    CANCELLATION_REASON_MAX_LENGTH: "Cancellation reason cannot exceed 500 characters"
};