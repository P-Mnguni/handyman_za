import { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import LoadingSpinner from "../components/LoadingSpinner";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await getCustomers();
            // Handle nested response structure (similar to jobs)
            const customersData = response.data?.customers || response.data || [];
            setCustomers(customersData);
            setError(null);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);
    
    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-red-100 text-red-800',
            inactive: 'bg-gray-100 text-gray-800'
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };
    
    // Filter customers based on status and search
    const filteredCustomers = customers.filter(customer => {
        if (filter !== 'all' && customer.status.toLowerCase() !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                customer.name?.toLowerCase().includes(term) ||
                customer.email?.toLowerCase().includes(term) ||
                customer.phone?.includes(term) ||
                customer.location?.city?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    // Calculate customer statistics
    const statusCounts = {
        all: customers.length,
        active: customers.filter(c=> c.status?.toLowerCase() === 'active').length,
        suspended: customers.filter(c => c.status?.toLowerCase() === 'suspended').length,
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <LoadingSpinner size="large" color="gray" text="Loading customers..." />;
    }

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
                        onClick={fetchCustomers}
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
                <h1 className="text-2xl font-bold text-gray-800">Customers Management</h1>
                <p className="text-gray-600 mt-1">View and manage all customers using platform.</p>
            </div>

            {/* Filters and Search */}
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
                        All ({statusCounts.all})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'active'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                        Active ({statusCounts.active})
                    </button>
                    <button
                        onClick={() => setFilter('suspended')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'suspended'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                    >
                        Suspended ({statusCounts.suspended})
                    </button>
                </div>

                {/* Search and refresh */}
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search customers..."
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
                        onClick={fetchCustomers}
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

            {/* Customers Table last update */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Jobs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                    Total Spent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[11%]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center 
                                            text-purple-600 font-semibold mr-3">
                                                {customer.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">{customer.email}</div>
                                                <div className="mt-1">{getVerificationBadge(customer.verified)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer.phone}</div>
                                        <div className="text-xs text-gray-500">Last active: {customer.lastActive}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{customer.location}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{customer.totalJobs}</div>
                                        <div className="text-xs text-gray-500">
                                            {customer.completedJobs} completed · {customer.cancelledJobs} cancelled
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{customer.totalSpent}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{customer.joinedDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(customer.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
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
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2
                                                        1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
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

                {/* Empty state */}
                {filteredCustomers.length === 0 && (
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
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4
                                0 018 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                        <p className="text-gray-500">Try adjusting your filters or add a new customer.</p>
                    </div>
                )}
            </div>

            {/* Customer Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Customers */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Customers by Spending</h2>
                    <div className="space-y-4">
                        {customers
                            .sort((a, b) => {
                                const aVal = parseFloat(a.totalSpent.replace('R', '').replace(',', ''));
                                const bVal = parseFloat(b.totalSpent.replace('R', '').replace(',', ''));
                                return bVal - aVal;
                            })
                            .slice(0, 5)
                            .map((customer, index) => (
                                <div key={customer.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center
                                        text-purple-600 font-semibold text-xs mr-3">
                                            {customer.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.totalJobs} jobs</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{customer.totalSpent}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Customer Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Activity</h2>
                    <div className="space-y-4">
                        {customers
                            .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
                            .slice(0, 5)
                            .map((customer) => (
                                <div key={customer.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-800">
                                                <span className="font-medium">{customer.name}</span> was active
                                            </p>
                                            <p className="text-xs text-gray-500">{customer.lastActive}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(customer.status)}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    Showing <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{customers.length}</span> customers
                </div>
                <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900">Previous</button>
                    <button className="text-gray-600 hover:text-gray-900">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Customers;