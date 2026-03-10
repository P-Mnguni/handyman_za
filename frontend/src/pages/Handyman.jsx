import { useState } from "react";

const Handymen = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample handymen data - will be replaced with API data
    const handymen = [
        {
            id: 1,
            name: 'Peter Khumalo',
            phone: '+27 71 234 5678',
            email: 'peter.khumalo@example.com',
            skills: ['Plumbing', 'Electrical'],
            rating: 4.8,
            completedJobs: 156,
            status: 'active',
            location: 'Johannesburg',
            joinedDate: '2023-08-15',
            verified: true,
            avatar: 'PK'
        },
        {
            id: 2,
            name: 'Mike Thompson',
            phone: '+27 82 345 6789',
            email: 'mike.t@example.com',
            skills: ['Electrical', 'Appliance Repair'],
            rating: 4.9,
            completedJobs: 203,
            status: 'active',
            location: 'Cape Town',
            joinedDate: '2023-06-22',
            verified: true,
            avatar: 'MT'
        },
        {
            id: 3,
            name: 'David Williams',
            phone: '+27 73 456 7890',
            email: 'david.w@example.com',
            skills: ['Plumbing', 'Carpentry'],
            rating: 4.6,
            completedJobs: 98,
            status: 'active',
            location: 'Durban',
            joinedDate: '2023-11-10',
            verified: true,
            avatar: 'DW'
        },
        {
            id: 4,
            name: 'Sarah van der Merwe',
            phone: '+27 64 567 8901',
            email: 'sarah.v@example.com',
            skills: ['Painting', 'Decorating'],
            rating: 4.9,
            completedJobs: 67,
            status: 'active',
            location: 'Pretoria',
            joinedDate: '2024-01-05',
            verified: true,
            avatar: 'SV'
        },
        {
            id: 5,
            name: 'John Smith',
            phone: '+27 75 678 9012',
            email: 'john.s@example.com',
            skills: ['Electrical', 'Plumbing'],
            rating: 4.2,
            completedJobs: 45,
            status: 'suspended',
            location: 'Johannesburg',
            joinedDate: '2024-02-18',
            verified: false,
            avatar: 'JS'
        },
        {
            id: 6,
            name: 'Thabo Ndlovu',
            phone: '+27 86 789 0123',
            email: 'thabo.n@example.com',
            skills: ['Carpentry', 'Furniture Assembly'],
            rating: 4.7,
            completedJobs: 112,
            status: 'active',
            location: 'Cape Town',
            joinedDate: '2023-09-30',
            verified: true,
            avatar: 'TN'
        },
        {
            id: 7,
            name: 'Lisa Reddy',
            phone: '+27 77 890 1234',
            email: 'lisa.r@example.com',
            skills: ['Cleaning', 'Organizing'],
            rating: 4.5,
            completedJobs: 89,
            status: 'pending',
            location: 'Durban',
            joinedDate: '2024-03-01',
            verified: false,
            avatar: 'LR'
        },
    ];

    const getStatusBadge = (status) => {
        switch(status) {
            case 'active':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
            case 'suspended':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Suspended</span>
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending Verification</span>
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unknown</span>
        }
    };

    const getVerificationBadge = (verified) => {
        return verified
            ? <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Verified</span>
            : <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Unverified</span>
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStar = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">{rating.toFixed(1)}</span>
                <div className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <span key={`full-${i}`} className="text-yellow-400">∗</span>
                    ))}
                    {halfStar && <span className="text-yellow-400">½</span>}
                    {[...Array(emptyStar)].map((_, i) => (
                        <span key={`empty-${i}`} className="text-gray-300">∗</span>
                    ))}
                </div>
            </div>
        );
    };

    // Filter handymen based on status and search
    const filteredHandymen = handymen.filter(handyman => {
        if (filter !== 'all' && handyman.status !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                handyman.name.toLowerCase().includes(term) ||
                handyman.email.toLowerCase().includes(term) ||
                handyman.phone.includes(term) ||
                handyman.location.toLowerCase().includes(term) ||
                handyman.skills.some(skill => skill.toLowerCase().includes(term))
            );
        }
        return true;
    });

    // Calculate stats
    const stats = {
        total: handymen.length,
        active: handymen.filter(h => h.status === 'active').length,
        pending: handymen.filter(h => h.status === 'pending').length,
        suspended: handymen.filter(h => h.status === 'suspended').length,
        verified: handymen.filter(h => h.verified).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Handyman Management</h1>
                <p className="text-gray-600 mt-1">View, verify, and manage all registered handymen on the platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Handymen</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Suspended</p>
                    <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Verified</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
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
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        }`}
                    >
                        Pending ({stats.pending})
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
                </div>

                {/* Search and actions */}
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
                        Add Handyman
                    </button>
                </div>
            </div>

            {/* Handymen Grid/Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thread className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                    Handyman
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                    Skills
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Ratings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Jobs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                    Actions
                                </th>
                            </tr>
                        </thread>
                        <tbody className="divide-y divide-gray-200">
                            {filteredHandymen.map((handyman) => (
                                <tr key={handyman.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center 
                                            text-blue-600 font-semibold mr-3">
                                                {handyman.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{handyman.name}</div>
                                                <div className="text-xs text-gray-500">{handyman.email}</div>
                                                <div className="mt-1">{getVerificationBadge(handyman.verified)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{handyman.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {handyman.skills.map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStars(handyman.rating)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{handyman.completedJobs}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{handyman.location}</div>
                                        <div className="text-xs text-gray-400">Joined {handyman.joinedDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(handyman.status)}
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
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1
                                                        1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
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
                {filteredHandymen.length === 0 && (
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
                                015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3
                                3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No handymen found</h3>
                        <p className="text-gray-500">Try adjusting your filters or add a new handyman.</p>
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center text-sm">
                <div className="text-gray-600">
                    Showing <span className="font-medium">{filteredHandymen.length}</span> of <span className="font-medium">{handymen.length}</span> handymen
                </div>
                <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900">Previous</button>
                    <button className="text-gray-600 hover:text-gray-900">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Handymen;