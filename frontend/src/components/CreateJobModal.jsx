import React, { useState, useEffect } from "react";
import { createJob } from "../api/jobService";

const CreateJobModal = ({ isOpen, onClose, onSubmit, onJobCreated }) => {
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceCategory: 'plumbing',
        location: '',
        budget: '',
        isNegotiable: false,
        priority: 'low'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                title: '',
                description: '',
                serviceCategory: 'plumbing',
                location: '',
                budget: '',
                isNegotiable: false,
                priority: 'low'
            });
            setErrors({});
        }
    }, [isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Service title is required';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (formData.budget && isNaN(formData.budget)) {
            newErrors.budget = 'Budget must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const jobData = {
                ...formData,
                budget: formData.budget ? parseFloat(formData.budget) : null
            };

            // Call the API to create the job
            await createJob(jobData);

            // If onSubmit prop is provided, call it with the new job data
            if (onSubmit) {
                await onSubmit(jobData);
            }

            // Call onJobCreated to refresh the jobs list
            if (onJobCreated) {
                await onJobCreated();
            }
            
            // Close modal on success
            onClose();
        } catch (error) {
            console.error('Error creating job:', error);
            setErrors({ 
                submit: error.response?.data?.message || 'Failed to create job. Please try again.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // Don't render if modal is closed
    if (!isOpen) return null;

    // Service categories (from your backend constants)
    const serviceCategories = [
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'painting', label: 'Painting' },
        { value: 'carpentry', label: 'Carpentry' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'moving', label: 'Moving' },
        { value: 'gardening', label: 'Gardening' },
        { value: 'other', label: 'Other' },
    ];

    // Priority options
    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-orange-600' },
        { value: 'high', label: 'High', color: 'text-red-600' },
    ];

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black opacity-50 transition-opacity"
            onClick={handleOverlayClick}
        >
            {/* Modal Card */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Job</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">
                                Service Title <span className="text-red-500">⁎</span>
                            </label>
                            <input 
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Fix leaking tap, Paint bedroom, etc."
                                className={`
                                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }
                                `}
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">⁎</span>
                            </label>
                            <textarea 
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Detailed description of the job..."
                                className={`
                                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    }
                                `}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.description ? (
                                    <p className="text-xs text-red-600">{errors.description}</p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        Minimum 20 characters. {formData.description.length}/20
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Service Category and Priority (2 columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Service Category */}
                            <div>
                                <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">∗</span>
                                </label>
                                <select
                                    id="serviceCategory"
                                    name="serviceCategory"
                                    value={formData.serviceCategory}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500"
                                >
                                    {serviceCategories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500"
                                >
                                    {priorityOptions.map(opt => (
                                        <option key={opt.value} value={opt.value} className={opt.color}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location <span className="text-red-500">∗</span>
                            </label>
                            <input 
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, suburb, or full address"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.location && (
                                <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                            )}
                        </div>

                        {/* Budget and Negotiable (2 columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Budget */}
                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget (R)
                                </label>
                                <input
                                    type="number"
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g., 500"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.budget ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.budget && (
                                    <p className="mt-1 text-xs text-red-600">{errors.budget}</p>
                                )}
                            </div>

                            {/* Negotiable checkbox */}
                            <div className="flex items-center mt-6">
                                <input 
                                    type="checkbox"
                                    id="isNegotiable"
                                    name="isNegotiable"
                                    checked={formData.isNegotiable}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isNegotiable" className="ml-2 block text-sm text-gray-700">
                                    Budget is negotiable
                                </label>
                            </div>
                        </div>

                        {/* Submit error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
                            hover:bg-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.962 0 014 12H0c0
                                            3.042 1.135 5.824 3 7.93813-2.647z"
                                        />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                'Create Job'
                            )}
                        </button>
                    </div>            
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;