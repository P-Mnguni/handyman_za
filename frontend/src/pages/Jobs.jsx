import { useState } from "react";

const Jobs = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample jobs data- will be replaced with API data later
    const jobs = [
        {
            id: 1,
            title: 'Fix leaking tap',
            description: 'Kitchen tap leaking continuously',
            customer: 'John D.',
            date: '2024-03-15',
            status: 'in-progress',
            budget: 'R450',
            location: 'Cape Town'
        },
        {
            id: 2,
            title: 'Electrical wiring',
            description: 'Need new socket installed in bedroom',
            customer: 'Sarah M.',
            date: '2024-03-14',
            status: 'completed',
            budget: 'R850',
            location: 'Johannesburg'
        },
        {
            id: 3,
            title: 'Paint bedroom',
            description: 'One bedroom needs fresh paint',
            customer: 'Peter K.',
            date: '2024-03-13',
            status: 'pending',
            budget: 'R1,200',
            location: 'Durban'
        },
        {
            id: 4,
            title: 'Install ceiling fan',
            description: 'Replace old fan with new one',
            customer: 'Lisa R.',
            date: '2024-03-12',
            status: 'in-progress',
            budget: 'R650',
            location: 'Pretoria'
        },
        {
            id: 5,
            title: 'Unblock sink',
            description: 'Kitchen sink blocked',
            customer: 'Mark T.',
            date: '2024-03-11',
            status: 'completed',
            budget: 'R350',
            location: 'Cape Town'
        },
        {
            id: 6,
            title: 'Fix geyser',
            description: 'Geyser not heating water',
            customer: 'Jenny L.',
            date: '2024-03-10',
            status: 'pending',
            budget: 'R950',
            location: 'Johannesburg'
        },
    ];

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
            case 'in-progress':
                return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    // Filter jobs based on status filter and search term
    const filteredJobs = jobs.filter(job => {
        // Status filter
        if (filter !== 'all' && job.status !== filter) return false;

        // Search filter
        if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
                <p className="text-gray-600 mt-1">Manage and track all your jobs in one place.</p>
            </div>
            
            {/* Filters and search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* Status filter tabs */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All Jobs
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Completed
                    </button>
                </div>

                {/* Search and Create button */}
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700
                    transition-colors flex items-center">
                        <svg 
                            className="h-5 w-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Job
                    </button>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="p-6">
                            {/* Header with status */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                                {getStatusBadge(job.status)}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4">{job.description}</p>

                            {/* Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>{job.customer}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 0 16 0z"
                                        />
                                    </svg>
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>{job.date}</span>
                                </div>
                                <div className="flex items-center text-gray-900 font-medium">
                                    <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s 1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402
                                            2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{job.budget}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-6 flex space-x-3">
                                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                                hover:bg-blue-700 transition-colors">
                                    View Details
                                </button>
                                <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium
                                rounded-lg hover:bg-gray-50 transition-colors">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
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
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0
                            00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Jobs Found</h3>
                    <p className="text-gray-500">Try adjusting your filters or create a new job.</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;