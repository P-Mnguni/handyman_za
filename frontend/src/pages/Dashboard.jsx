import StatCard from '../components/StatCard';

const Dashboard = () => {
    // Simple data - will be replaced with real API data later
    const stats = [
        { title: 'Total Jobs', value: '24', change: '+12%', icon: '🔧' },
        { title: 'Active Jobs', value: '8', change: '+3', icon: '⚡' },
        { title: 'Completed Jobs', value: '156', change: '+23%', icon: '✅' },
        { title: 'Revenue', value: 'R4,250', change: '+18%', icon: '💰' },
        { title: 'Customers', value: '42', change: '+6', icon: '👥' },
        { title: 'Rating', value: '4.8', change: '+0.2', icon: '⭐' },
    ];

    const recentJobs = [
        { id: 1, title: 'Fix leaking tap', status: 'In Progress', customer: 'John D.', date: '2024-03-15' },
        { id: 2, title: 'Electrical wiring', status: 'Completed', customer: 'Sarah M.', date: '2024-03-14' },
        { id: 3, title: 'Paint bedroom', status: 'Pending', customer: 'Peter K.', date: '2024-03-13' },
        { id: 4, title: 'Install ceiling fan', status: 'In Progress', customer: 'Lisa R.', date: '2024-03-12' },
        { id: 5, title: 'Unblock sink', status: 'Completed', customer: 'Mark T.', date: '2024-03-11' },
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='space-y-6'>
            {/* Welcome section */}
            <div>
                <h2 className='text-2xl font-bold text-gray-800'>Welcome back, User! 👋</h2>
                <p className='text-gray-600 mt-1'>Here's what's happening with your business today.</p>
            </div>

            {/* Stats grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent jobs section */}
            <div className='bg-white rounded-lg shadow'>
                <div className='px-6 py-4 border-b border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-800'>Recent Jobs</h3>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full table-fixed'>
                        <thread className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]'>
                                    Job
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]'>
                                    Customer
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]'>
                                    Date
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]'>
                                    Action
                                </th>
                            </tr>
                        </thread>
                        <tbody className='divide-y divide-gray-200'>
                            {recentJobs.map((job) => (
                                <tr key={job.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 text-sm font-medium text-gray-900 truncate'>{job.title}</td>
                                    <td className='px-6 py-4 text-sm text-gray-600'>{job.customer}</td>
                                    <td className='px-6 py-4 text-sm text-gray-600'>{job.date}</td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-sm'>
                                        <button className='text-blue-600 hover:text-blue-800'>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='px-6 py-4 border-t border-gray-200'>
                    <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                        View all jobs →
                    </button>
                </div>
            </div>

            {/* Quick actions */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
                    <div className='space-y-3'>
                        <button className='w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'>
                            📝 Create new job
                        </button>
                        <button className='w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'>
                            🗓️ Schedule appointment
                        </button>
                        <button className='w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'>
                            💬 Send invoice
                        </button>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Recent Activity</h3>
                    <div className='space-y-4'>
                        <div className='flex items-start space-x-3'>
                            <div className='h-2 w-2 mt-2 bg-green-500 rounded-full'></div>
                            <div>
                                <p className='text-sm text-gray-800'>Job completed: Fix leaking tap</p>
                                <p className='text-xs text-gray-500'>2 hours ago</p>
                            </div>
                        </div>
                        <div className='flex items-start space-x-3'>
                            <div className='h-2 w-2 mt-2 bg-blue-500 rounded-full'></div>
                            <div>
                                <p className='text-sm text-gray-800'>New Job Posted: Electrical wiring</p>
                                <p className='text-xs text-gray-500'>5 hours ago</p>
                            </div>
                        </div>
                        <div className='flex items-start space-x-3'>
                            <div className='h-2 w-2 mt-2 bg-yellow-500 rounded-full'></div>
                            <div>
                                <p className='text-sm text-gray-800'>Payment received: R850</p>
                                <p className='text-xs text-gray-500'>Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;