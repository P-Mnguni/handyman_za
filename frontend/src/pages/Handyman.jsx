import { useState, useEffect } from "react";
import { getHandymen } from "../services/handymanServices";
import LoadingSpinner from "../components/LoadingSpinner";
import HandymenTable from "../components/handymen/HandymenTable";

const Handymen = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [handymen, setHandymen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHandymen();
    }, []);

    const fetchHandymen = async () => {
        try {
            setLoading(true);
            const data = await getHandymen();
            setHandymen(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching handymen:', err);
            setError('Failed to load handymen. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter handymen based on status and search
    const filteredHandymen = handymen.filter(handyman => {
        if (filter !== 'all' && handyman.status !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                handyman.name?.toLowerCase().includes(term) ||
                handyman.email?.toLowerCase().includes(term) ||
                handyman.location?.city?.toLowerCase().includes(term) ||
                handyman.skills.some(skill => skill.toLowerCase().includes(term))
            );
        }
        return true;
    });

    // Calculate stats
    const statusCount = {
        all: handymen.length,
        verified: handymen.filter(h => h.status === 'verified').length,
        pending: handymen.filter(h => h.status === 'pending').length,
        suspended: handymen.filter(h => h.status === 'suspended').length
    };

    // Placeholder handlers (to be implemented later)
    const handleView = (handyman) => {
        console.log('View handyman:', handyman);
    };

    const handleVerify = (handyman) => {
        console.log('Verify handyman:', handyman);
    };

    const handleSuspend = (handyman) => {
        console.log('Suspend handyman:', handyman);
    }

    if (loading) {
        return <LoadingSpinner size="large" color="gray" text="Loading handymen..." />;
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                    <svg 
                        className="h-12 w-12 text-red-500 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchHandymen}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Handyman Management</h1>
                <p className="text-gray-600 mt-1">View, verify, and manage all registered service professionals on the platform</p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col lg:flex-row gap-4 justify-between">
                {/* Status filters */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All ({statusCount.all})
                    </button>
                    <button
                        onClick={() => setFilter('verified')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'verified'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                        Verified ({statusCount.verified})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        Pending ({statusCount.pending})
                    </button>
                    <button
                        onClick={() => setFilter('suspended')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'suspended'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                    >
                        Suspended ({statusCount.suspended})
                    </button>
                </div>

                {/* Search and Refresh */}
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search handymen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                            focus:ring-blue-500 focus:border-transparent w-full sm:w-64" 
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
                    <button 
                        onClick={fetchHandymen}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                                01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Handymen Table Component */}
            <HandymenTable
                handymen={filteredHandymen}
                onView={handleView}
                onVerify={handleVerify}
                onSuspend={handleSuspend}
            />
            
            {/* Summary Footer */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    Showing{' '}<span className="font-medium">{filteredHandymen.length}</span>{' '}
                    of{' '}<span className="font-medium">{handymen.length}</span>{' '}handymen
                </div>
                <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Handymen;