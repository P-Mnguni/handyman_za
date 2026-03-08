import { useState } from "react";
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Function to get page title from path
    const getPageTitle = () => {
        const path = location.pathname;

        if (path === '/dashboard' || path === '/') return 'Dashboard';
        if (path === '/jobs') return 'Jobs';
        if (path === '/messages') return 'Messages';
        if (path === '/profile') return 'Profile';
        if (path === '/settings') return 'Settings';

        // Default fallback
        return 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <header className="bg-white shadow-sm h-16 shrink-0 sticky top-0 z-30">
                    <div className="h-full px-4 flex items-center justify-between">
                        {/* Left section with hamburger menu */}
                        <div className="flex items-center">
                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden mr-3"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            
                            <h2 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h2>
                        </div>

                        {/* Right section */}
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

            {/* Mobile sidebar drawer - slides in from left */}   
            <>
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-600 opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar drawer */}
                <div className={`
                        fixed top-0 left-0 h-full w-64 z-50 lg:hidden transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    `}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>
                
            </>
            
        </div>
    );
};

export default DashboardLayout;