import React from "react";

const JobsTable = ({ jobs = [] }) => {
    // Helper function to get status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            accepted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
            in_progress: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    // Helper function for priority badge
    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
            medium: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Medium' },
            low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
        };

        const config = priorityConfig[priority] || priorityConfig.low;

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency
    const formatBudget = (budget) => {
        if (!budget) return 'Negotiable';
        return `R${budget.toLocaleString()}`;
    };

    return (
        <div className="rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Handyman
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Budget
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                                    No Jobs found
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id || job.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {job.client.name || job.customer || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {job.title || job.service}
                                        </div>
                                        {job.description && (
                                            <div className="text-xs text-gray-500 truncate max-w-xs">
                                                {job.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {job.serviceCategory || job.category || 'General'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {job.location.city || job.location || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {job.handyman.name || job.handyman || 'Unassigned'}
                                        </div>
                                        {(!job.handyman || job.handyman === 'Unassigned') && (
                                            <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                                                Assign
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {formatBudget(job.budget)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(job.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getPriorityBadge(job.priority || 'low')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(job.createdAt || job.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {job.status === 'pending' && (
                                                <>
                                                    <button className="text-xs text-blue-600 hover:text-blue-800">
                                                        Edit
                                                    </button>
                                                    <button className="text-xs text-red-600 hover:text-red-800">
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0
                                                        110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );    
};

export default JobsTable