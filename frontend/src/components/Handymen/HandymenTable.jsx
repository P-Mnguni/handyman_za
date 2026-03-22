import React from "react";

const HandymenTable = ({ handymen, onVerify, onView, onSuspend }) => {
    // Helper func to get status badge color
    const getStatusBadge = (status) => {
        const colors = {
            verified: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            suspended: 'bg-red-100 text-red-800',
            inactive: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800'
    };

    // Helper func to get ratings stars
    const getRatingStars = (rating) => {
        if (!rating || rating === 0) return 'No ratings';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating & 1 >= 0.5;
        return `${'∗'.repeat(fullStars)}${hasHalfStar ? '½' : ''}${'▿'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))} (${rating})`;
    };

    if (!handymen || handymen.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
                        015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3
                        3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No handymen found</h3>
                <p className="text-gray-500">No handymen are registered on the platform yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Handyman
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Skills
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jobs Completed
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {handymen.map((handyman) => (
                            <tr key={handyman._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center 
                                        text-white font-semibold">
                                            {handyman.name?.charAt(0) || 'H'}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{handyman.name}</div>
                                            <div className="text-sm text-gray-500">{handyman.email}</div>
                                            {handyman.phone && <div className="text-xs text-gray-400">{handyman.phone}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {handyman.skills?.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {skill}
                                            </span>
                                        ))}
                                        {handyman.skills?.length > 3 && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                                +{handyman.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {handyman.location?.city || 'N/A'}
                                    {handyman.location?.area && <div className="text-xs text-gray-400">{handyman.location.area}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-yellow-600">
                                        {getRatingStars(handyman.rating)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {handyman.completedJobs || 0}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(handyman.status)}`}>
                                        {handyman.status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {handyman.createdAt ? new Date(handyman.createdAt).toLocaleDateString('en-ZA') : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => onView?.(handyman)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View
                                        </button>
                                        {handyman.status === 'pending' && (
                                            <button
                                                onClick={() => onVerify?.(handyman)}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                            >
                                                Verify
                                            </button>
                                        )}
                                        {handyman.status === 'verified' && (
                                            <button
                                                onClick={() => onSuspend?.(handyman)}
                                                className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                            >
                                                Suspend
                                            </button>
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
                                                    d="M12 5v.01M12 12v.01M12 19.v01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010
                                                    2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HandymenTable;