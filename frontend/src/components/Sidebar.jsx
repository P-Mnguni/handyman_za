import { NavLink } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/jobs', label: 'Jobs', icon: '🛠️' },
        { path: '/handymen', label: 'Handymen', icon: '👷' },
        { path: '/customers', label: 'Customers', icon: '👥' },
        { path: '/payments', label: 'Payments', icon: '💰' },
        { path: '/reviews', label: 'Reviews', icon: '⭐' },
        { path: '/reports', label: 'Reports', icon: '📈' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className='w-64 bg-white h-screen flex flex-col border-r border-gray-200'>
            {/* Logo */}
            <div className='h-16 flex items-center justify-center border-b border-gray-200'>
                <h1 className='text-xl font-bold text-blue-600'>Handyman.za</h1>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4'>
                <ul className='space-y-2'>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <span className='mr-3 text-lg'>{item.icon}</span>
                                <span className='font-medium'>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom section - will add logout later */}
            <div className='p-4 border-t border-gray-200'>
                <div className='flex items-center mb-3'>
                    <div className='h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold mr-3'>
                        A
                    </div>
                    <div className='text-sm text-gray-800'>Logged in as Admin</div>
                </div>
                <button className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg 
                transition-colors flex items-center'>
                    <svg
                        className='h-4 w-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4vv1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                        />
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;