//import { useState } from "react";
import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/jobs', label: 'Jobs', icon: '🛠️' },
        { path: '/messages', label: 'Messages', icon: '💬' },
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - fixed width, full height */}
            <aside className="w-64 bg-white shadow-lg h-screen flex flex-col shrink-0">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600">Handyman.za</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main content area - takes remaining width */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="bg-white shadow-sm h-16 shrink-0">
                    <div className="h-full px-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                                        2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 
                                        0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </button>

                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                U
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4 px-4">
                    <p className="text-sm text-gray-500 text-center">
                        © 2026 Handyman.za. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;