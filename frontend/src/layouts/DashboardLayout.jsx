import { useState } from "react";
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

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
                {/* Topbar with hamburger for mobile */}
                <div className="relative">
                    {/* Mobile hamburger - positioned absolutely on mobile */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-gray-600 
                        hover:bg-gray-100 focus:outline-none lg:hidden z-20"
                        style={{ top: '28px' }}
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

                    {/* Topbar */}
                    <Topbar 
                        pageTitle={getPageTitle()}
                        onMenuClick={() => setSidebarOpen(true)}
                    />
                </div>

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

            {/* Mobile sidebar drawer */}   
            <>
                {/* Backdrop */}
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