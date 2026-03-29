import { useState } from "react";
import { createCustomer } from "../../services/customerService";

const CreateCustomerModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        location: {
            city: '',
            area:''
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const[parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ 
                ...prev,
                [name]: ''
            }));
        }
        if (submitError) setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!newErrors.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!newErrors.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!newErrors.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Prepare data for API
        const customerData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim()
        };

        // Remove firstName and lastName
        delete customerData.firstName;
        delete customerData.lastName;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await createCustomer(customerData);

            if (onSuccess) {
                await onSuccess();
            }

            onClose();
        } catch (err) {
            console.error('Error creating customer:', err);
            setSubmitError(err.response?.data?.message || 'Failed to create customer. Please try again.');
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            location: { city: '', area: '' }
        });
        setErrors({});
        setSubmitError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={handleClose} />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">Add New Customer</h2>
                        <p className="text-sm text-gray-500 mt-1">Create a new customer account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                        {/* Submit Error */}
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                {submitError}
                            </div>
                        )}

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                    disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Location Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="location.city"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                            errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Cape Town"
                                />
                                {errors['location.city'] && (
                                    <p className="text-red-500 text-xs mt-1">{errors['location.city']}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Area (optional)
                                </label>
                                <input
                                    type="text"
                                    name="location.area"
                                    value={formData.location.area}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="e.g., Sea Point"
                                />
                            </div>
                        </div>

                        {/* Action */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 mt-6">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 
                                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
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
                                        'Create Customer'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCustomerModal;