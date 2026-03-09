import StatCard from '../components/StatCard';

const DashboardHome = () => {
    // Simple data - will be replaced with real API data later
    const stats = [
        { title: 'Total Jobs', value: '1,247', change: '+12.3%', icon: '🔧' },
        { title: 'Active Jobs', value: '43', change: '+5', icon: '⚡' },
        { title: 'Completed Jobs', value: '1,189', change: '+11.2%', icon: '✅' },
        { title: 'Total Revenue', value: 'R284,500', change: '+18.4%', icon: '💰' },
        { title: 'Pending Payouts', value: 'R18,250', change: '-2.1%', icon: '⏳' },
        { title: 'Handymen', value: '86', change: '+7', icon: '👷' },
        { title: 'Customers', value: '412', change: '+23', icon: '👥' },
        { title: 'Avg. Rating', value: '4.8', change: '+0.1', icon: '⭐' },
        { title: 'New Today', value: '12', change: '+3', icon: '🆕' },
    ];

    const recentActivities = [
        { id: 1, user: 'John D.', action: 'created a new job', target: 'Fix leaking tap', time: '5 min ago', type: 'job' },
        { id: 2, user: 'Sarah M.', action: 'completed job', target: 'Electrical wiring', time: '15 min ago', type: 'completion' },
        { id: 3, user: 'Mike T.', action: 'registered as handyman', target: '', time: '32 min ago', type: 'registration' },
        { id: 4, user: 'Lisa R.', action: 'left a review', target: '5 stars for Peter K.', time: '1 hour ago', type: 'review' },
        { id: 5, user: 'Admin', action: 'processed payout', target: 'R850 to Peter K.', time: '2 hours ago', type: 'payment' },
    ];

    const quickActions = [
        { label: 'Create New Job', icon: '➕', color: 'blue' },
        { label: 'Add Handyman', icon: '👷', color: 'green' },
        { label: 'Process Payouts', icon: '💰', color: 'purple' },
        { label: 'View Reports', icon: '📊', color: 'orange' },
    ];

    const getActivityIcon = (type) => {
        switch(type) {
            case 'job': return '🛠️';
            case 'completion': return '✅';
            case 'registration': return '👤';
            case 'review': return '⭐';
            case 'payment': return '💰';
            default: return '📌';
        }
    };

    return (
        <div className='space-y-6'>
            {/* Welcome section */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
                    <p className='text-gray-600 mt-1'>Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className='text-right'>
                    <p className='text-sm text-gray-500'>{new Date().toLocaleDateString('en-US', 
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
                        )}
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Two column layout for charts / recent activity */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Recent Activity */}
                <div className='lg:col-span-2 bg-white rounded-lg shadow'>
                    <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
                        <h2 className='text-lg font-semibold text-gray-800'>Recent Platform Activity</h2>
                        <button className='text-sm text-blue-600 hover:text-blue-800'>View All</button>
                    </div>
                    <div className='divide-y divide-gray-100'>
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className='px-6 py-4 hover:bg-gray-50 transition-colors'>
                                    <div className='flex items-start'>
                                        <div className='text-2xl mr-3'>{getActivityIcon(activity.type)}</div>
                                        <div className='flex-1'>
                                            <p className='text-sm text-gray-800'>
                                                <span className='font-medium'>{activity.user}{' '}</span>{activity.action}{' '}
                                                {activity.target && <span className='font-medium text-gray-900'>{activity.target}</span>}
                                            </p>
                                            <p className='text-xs text-gray-500 mt-1'>{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>

                {/* Quick Actions and Stats - takes 1 column */}
                <div className='space-y-6'>
                    {/* Quick actions */}
                    <div className='bg-white rounded-lg shadow'>
                        <div className='px-6 py-4 border-b border-gray-200'>
                            <h2 className='text-lg font-semibold text-gray-800 '>Quick Actions</h2>
                        </div>
                        <div className='p-4 space-y-2'>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center bg-gray-50 
                                        hover:bg-gray-100`}
                                >
                                    <span className='text-xl mr-3'>{action.icon}</span>
                                    <span className='text-sm font-medium text-gray-700'>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Platform Health */}
                    <div className='bg-white rounded-lg shadow'>
                        <div className='px-6 py-4 border-b border-gray-200'>
                            <h2 className='text-lg font-semibold text-gray-800'>Platform Health</h2>
                        </div>
                        <div className='p-4 space-y-4'>
                            <div>
                                <div className='flex justify-between text-sm mb-1'>
                                    <span className='text-gray-600'>Server Uptime</span>
                                    <span className='font-medium text-green-600'>99.9%</span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                    <div className='bg-green-500 h-2 rounded-full' style={{ width: '99.9%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between text-sm mb-1'>
                                    <span className='text-gray-600'>API Response</span>
                                    <span className='font-medium text-green-600'>124ms</span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                    <div className='bg-green-500 h-2 rounded-full' style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between text-sm mb-1'>
                                    <span className='text-gray-600'>Activity Users</span>
                                    <span className='font-medium text-blue-600'>38 online</span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                    <div className='bg-blue-500 h-2 rounded-full' style={{ width: '76%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;