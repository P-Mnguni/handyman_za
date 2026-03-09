import { useState } from "react";

const Jobs = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample jobs data- will be replaced with API data later
    const jobs = [
        {
            id: 1,
            customer: 'John D.',
            service: 'Fix leaking tap',
            category: 'Plumbing',
            location: 'Cape Town',
            handyman: 'Peter K.',
            status: 'in-progress',
            date: '2024-03-15',
            budget: 'R450',
            priority: 'medium'
        },
        {
            id: 2,
            customer: 'Sarah M.',
            service: 'Electrical wiring',
            category: 'Electrical',
            location: 'Johannesburg',
            handyman: 'Mike T.',
            status: 'completed',
            date: '2024-03-14',
            budget: 'R850',
            priority: 'high'
        },
        {
            id: 3,
            customer: 'Peter K.',
            service: 'Paint bedroom',
            category: 'Painting',
            location: 'Durban',
            handyman: 'Unassigned',
            status: 'pending',
            date: '2024-03-13',
            budget: 'R1,200',
            priority: 'low'
        },
        {
            id: 4,
            customer: 'Lisa R.',
            service: 'Install ceiling fan',
            category: 'Electrical',
            location: 'Pretoria',
            handyman: 'John S.',
            status: 'in-progress',
            date: '2024-03-12',
            budget: 'R650',
            priority: 'medium'
        },
        {
            id: 5,
            customer: 'Mark T.',
            service: 'Unblock sink',
            category: 'Plumbing',
            location: 'Cape Town',
            handyman: 'David W.',
            status: 'completed',
            date: '2024-03-11',
            budget: 'R350',
            priority: 'high'
        },
        {
            id: 6,
            customer: 'Jenny L.',
            service: 'Fix geyser',
            category: 'Plumbing',
            location: 'Johannesburg',
            handyman: 'Unassigned',
            status: 'pending',
            date: '2024-03-10',
            budget: 'R950',
            priority: 'high'
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
            case 'cancelled':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'high':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High</span>
            case 'medium':
                return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Medium</span>
            case 'low':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Low</span>
            default:
                return null;
        }
    };

    // Filter jobs based on status filter and search term
    const filteredJobs = jobs.filter(job => {
        // Status filter
        if (filter !== 'all' && job.status !== filter) return false;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                job.customer.toLowerCase().includes(term) ||
                job.service.toLowerCase().includes(term) ||
                job.handyman.toLowerCase().includes(term) ||
                job.location.toLowerCase().includes(term)
            );
        }

        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Jobs Management</h1>
                <p className="text-gray-600 mt-1">View and manage all service requests across the platform.</p>
            </div>
            
            {/* Filters and Actions */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col lg:flex-row gap-4 justify-between">
                {/* Status filter tabs */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All Jobs ({jobs.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('in-progress')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'in-progress'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
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

            {/* Jobs Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thread className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                    Handyman
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Budget
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[11%]">
                                    Actions
                                </th>
                            </tr>
                        </thread>
                        <tbody className="divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.customer}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{job.service}</div>
                                        <div className="text-xs text-gray-500 mt-1">{getPriorityBadge(job.priority)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{job.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{job.handyman}</div>
                                        {job.handyman === 'Unassigned' && (
                                            <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">Assign</button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.budget}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{job.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(job.status)}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
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

            {/* Summary Footer */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    Showing <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{jobs.length}</span> jobs
                </div>
                <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900">Previous</button>
                    <button className="text-gray-600 hover:text-gray-900">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Jobs;