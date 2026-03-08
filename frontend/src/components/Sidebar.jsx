import { NavLink } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/jobs', label: 'Jobs', icon: '🛠️' },
        { path: '/messages', label: 'Messages', icon: '💬' },
        { path: '/profile', label: 'Profile', icon: '👤' },
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
                <div className='text-sm text-gray-500'>Logged in as User</div>
            </div>
        </aside>
    );
};

export default Sidebar;