import { useState } from "react";

const Customers = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample customers data - will be replaced with API data
    const customers = [
        {
            id: 1,
            name: 'John Dlamini',
            email: 'john.d@example.com',
            phone: '+27 71 234 5678',
            location: 'Johannesburg',
            totalJobs: 8,
            completedJobs: 6,
            cancelledJobs: 2,
            totalSpent: 'R4,250',
            status: 'active',
            joinedDate: '2023-09-15',
            lastActive: '2024-03-14',
            verified: true,
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Sarah Mokoena',
            email: 'sarah.m@example.com',
            phone: '+27 82 345 6789',
            location: 'Cape Town',
            totalJobs: 12,
            completedJobs: 11,
            cancelledJobs: 1,
            totalSpent: 'R8,950',
            status: 'active',
            joinedDate: '2023-06-22',
            lastActive: '2024-03-15',
            verified: true,
            avatar: 'SM'
        },
        {
            id: 3,
            name: 'Peter van Wyk',
            email: 'peter.v@example.com',
            phone: '+27 73 456 7890',
            location: 'Durban',
            totalJobs: 3,
            completedJobs: 2,
            cancelledJobs: 1,
            totalSpent: 'R1,450',
            status: 'inactive',
            joinedDate: '2024-01-10',
            lastActive: '2024-02-28',
            verified: true,
            avatar: 'PV'
        },
        {
            id: 4,
            name: 'Lisa Reddy',
            email: 'lisa.r@example.com',
            phone: '+27 64 567 8901',
            location: 'Pretoria',
            totalJobs: 15,
            completedJobs: 14,
            cancelledJobs: 1,
            totalSpent: 'R12,300',
            status: 'active',
            joinedDate: '2023-05-05',
            lastActive: '2024-03-15',
            verified: true,
            avatar: 'LR'
        },
        {
            id: 5,
            name: 'Mark Thompson',
            email: 'mark.t@example.com',
            phone: '+27 75 678 9012',
            location: 'Johannesburg',
            totalJobs: 1,
            completedJobs: 0,
            cancelledJobs: 1,
            totalSpent: 'R0',
            status: 'suspended',
            joinedDate: '2024-02-18',
            lastActive: '2024-02-20',
            verified: false,
            avatar: 'MT'
        },
        {
            id: 6,
            name: 'Thabo Ndlovu',
            email: 'thabo.n@example.com',
            phone: '+27 86 789 0123',
            location: 'Cape Town',
            totalJobs: 6,
            completedJobs: 5,
            cancelledJobs: 1,
            totalSpent: 'R3,850',
            status: 'active',
            joinedDate: '2023-11-30',
            lastActive: '2024-03-12',
            verified: true,
            avatar: 'TN'
        },
        {
            id: 7,
            name: 'Jenny Liebenberg',
            email: 'jenny.l@example.com',
            phone: '+27 77 890 1234',
            location: 'Durban',
            totalJobs: 2,
            completedJobs: 2,
            cancelledJobs: 0,
            totalSpent: 'R1,950',
            status: 'pending',
            joinedDate: '2024-03-01',
            lastActive: '2024-03-10',
            verified: false,
            avatar: 'JL'
        },
        {
            id: 8,
            name: 'David Williams',
            email: 'david.w@example.com',
            phone: '+27 78 901 2345',
            location: 'Port Elizabeth',
            totalJobs: 9,
            completedJobs: 8,
            cancelledJobs: 1,
            totalSpent: 'R6,750',
            status: 'active',
            joinedDate: '2023-08-12',
            lastActive: '2024-03-13',
            verified: true,
            avatar: 'DW'
        },
    ];

    const getStatusBadge = (status) => {
        switch(status) {
            case 'active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
            case 'inactive':
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
            case 'suspended':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Suspended</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending Verification</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>;
        }
    };

    const getVerificationBadge = (verified) => {
        return verified
            ? <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Verified</span>
            : <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unverified</span>
    };

    // Calculate customer statistics
    const stats = {
        total: customers.length,
        active: customers.filter(c=> c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        suspended: customers.filter(c => c.status === 'suspended').length,
        pending: customers.filter(c => c.status === 'pending').length,
        verified: customers.filter(c => c.verified).length,
        totalJobs: customers.reduce((sum, c) => sum + c.totalJobs, 0),
        totalSpent: customers.reduce((sum, c) => {
            const amount = parseFloat(c.totalSpent.replace('R', '').replace('.', ''));
            return sum + amount;
        }, 0),
    };

    // Filter customers based on status and search
    const filteredCustomers = customers.filter(customer => {
        if (filter !== 'all' && customer.status !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                customer.name.toLowerCase().includes(term) ||
                customer.email.toLowerCase().includes(term) ||
                customer.phone.includes(term) ||
                customer.location.toLowerCase().includes(term)
            );
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Customers Management</h1>
                <p className="text-gray-600 mt-1">View and manage all customers using platform.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Total Customers</p>
                    <p className="text-xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Inactive</p>
                    <p className="text-xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Suspended</p>
                    <p className="text-xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Verified</p>
                    <p className="text-xl font-bold text-blue-600">{stats.verified}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Total Jobs</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalJobs}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow col-span-1">
                    <p className="text-xs text-gray-500">Total Spent</p>
                    <p className="text-xl font-bold text-gray-800">R{stats.totalSpent.toLocaleString()}</p>
                </div>
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
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'active'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                        Active ({stats.active})
                    </button>
                    <button
                        onClick={() => setFilter('inactive')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'inactive'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Inactive ({stats.inactive})
                    </button>
                    <button
                        onClick={() => setFilter('suspended')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'suspended'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                    >
                        Suspended ({stats.suspended})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        Pending ({stats.pending})
                    </button>
                </div>

                {/* Search and actions */}
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
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customers Table */}
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