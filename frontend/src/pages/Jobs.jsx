import { useState, useEffect } from "react";
import { createJob, getAllJobs } from '../api/jobService.js';
import JobsTable from '../components/JobsTable.jsx';
import CreateJobModal from "../components/CreateJobModal.jsx";

const Jobs = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // fetchJobs as a reusable function
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getAllJobs();
            setJobs(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again later.')
        } finally {
            setLoading(false);
        }
    };

    // Fetch jobs from backend when component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job creation
    const handleCreateJob = async (jobData) => {
        try {
            await createJob(jobData);
            await fetchJobs();                          // Refresh the jobs first
            setIsModalOpen(false);                      // Close modal on success
        } catch (err) {
            console.error('Error creating job:', err);  // Error handled by modal component
            throw err;
        }
    };

    // Format date to match existing display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
    };

    // Map backend job data to match existing UI structure
    const mapJobToUI = (job) => ({
        id: job._id,
        _id: job._id,
        customer: job.client?.name || 'Unknown',
        service: job.title,
        category: job.serviceCategory || 'General',
        locationDisplay: job.location?.city || 'N/A',
        handymanDisplay: job.handyman?.name || 'Unassigned',
        status: job.status,
        date: formatDate(job.createdAt),
        budget: job.budget,
        priority: job.priority || 'low',
        description: job.description,
        client: job.client,
        createdAt: job.createdAt,
        serviceCategory: job.serviceCategory,
        location: job.location,
        handyman: job.handyman
    });

    // Filter jobs based on status filter and search term
    const filteredJobs = jobs
        .map(mapJobToUI)
        .filter(job => {
        if (filter !== 'all' && job.status !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                job.customer.toLowerCase().includes(term) ||
                job.service.toLowerCase().includes(term) ||
                job.handymanDisplay.toLowerCase().includes(term) ||
                job.locationDisplay.toLowerCase().includes(term) ||
                job.category.toLowerCase().includes(term)
            );
        }
        return true;
    });

    // Count jobs by status for filter buttons
    const jobCounts = {
        all: jobs.length,
        pending: jobs.filter(j => j.status === 'pending').length,
        'in-progress': jobs.filter(j => j.status === 'in_progress' || j.status === 'in-progress').length,
        completed: jobs.filter(j => j.status === 'completed').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading jobs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
                <button
                    onClick={fetchJobs}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Jobs Management</h1>
                    <p className="text-gray-600 mt-1">View and manage all service requests across the platform.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors
                    flex items-center shadow-sm"
                >
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
                    Create Job
                </button>
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
                        All Jobs ({jobCounts.all})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        Pending ({jobCounts.pending})
                    </button>
                    <button
                        onClick={() => setFilter('in-progress')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'in-progress'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                    >
                        In Progress ({jobCounts['in-progress']})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                        Completed ({jobCounts.completed})
                    </button>
                </div>

                {/* Search */}
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
            </div>

            {/* Jobs Table */}
            <JobsTable jobs={filteredJobs} />

            {/* Summary Footer */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    Showing <span className="font-medium">{filteredJobs.length}</span> of <span className="font-medium">{jobs.length}</span> jobs
                </div>
                <button 
                    onClick={fetchJobs}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                    <svg 
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                            01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Refresh
                </button>
            </div>
            
            {/* Create Job Modal */}
            <CreateJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateJob}
                onJobCreated={fetchJobs}
            />
        </div>
    );
};

export default Jobs;