import { useState } from "react";
import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Navigation items - will be moved to a config file later
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/jobs', label: 'Jobs', icon: '🛠️' },
        { path: '/messages', label: 'Messages', icon: '💬' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar backdrop */ }
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static insert-y-0 left-0 z-30 w-64 bg-white shadow-lg transform 
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto
                `}
            >
                {/* Logo area */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600">Handyman.za</h1>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                            isActive 
                                            ? 'big-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        })}
                    </ul>
                </nav>

                {/* Bottom section - add user info here for desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 lg:hidden">
                    <div className="text-sm text-gray-500">Logged in as: User</div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top navbar */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between px-4 h-16">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden"
                            aria-label="Toggle sidebar"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {sidebarOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>

                        {/* Page title - could be dynamic later */}
                        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
                            Dashboard
                        </h2>

                        {/* Right side nav items */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                                <span className="sr-only">Notifications</span>
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                                        2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538 -.214 1.055-.595 1.436L4
                                        17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User menu dropdown */}
                            <div className="relative">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center
                                    text-white font-semibold">
                                        U
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden md:block">
                                        User Name
                                    </span>
                                    <svg
                                        className="h-4 w-4 text-gray-500 hidden md:block"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown menu - hidden for now, will be implemented later */}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    <Outlet />
                </main>

                {/* Simple footer for consistency */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-500 text-center">
                        © 2024 Handyman.za. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;