import React from "react";
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
    // Normalize status string (handle both 'in_progress' and 'in-progress')
    const normalizedStatus = status.toLowerCase().replace('_', '-') || 'pending';

    // Configuration object for different statuses
    const statusConfig = {
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            label: 'Pending',
            icon: '⏳'
        },
        accepted: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            label: 'Accepted',
            icon: '✓'
        },
        assigned: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-200',
            label: 'Assigned',
            icon: '👤'
        },
        'in-progress': {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            label: 'In Progress',
            icon: '⚙️'
        },
        'in_progress': {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200',
            label: 'In Progress',
            icon: '⚙️'
        },
        completed: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200',
            label: 'Completed',
            icon: '✅'
        },
        cancelled: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-200',
            label: 'Cancelled',
            icon: '❌'
        },
        declined: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-200',
            label: 'Declined',
            icon: '✕'
        },
        expired: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200',
            label: 'Expired',
            icon: '⌛'
        },
    };

    // Get config for current status, fallback to pending if status not found
    const config = statusConfig[normalizedStatus] || statusConfig.pending;

    return (
        <span
            className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${config.bg } ${config.text} ${config.border} border 
                transition-all duration-200 hover:scale-105
            `}
            title={`Status: ${config.label}`}
        >
            <span className="mr-1 text-xs">{config.icon}</span>
            {config.label}
        </span>
    );
};

// PropTypes for better development experience
StatusBadge.propTypes = {
    status: PropTypes.string
};

// Default props
StatusBadge.defaultProps = {
    status: 'pending'
};

export default StatusBadge;