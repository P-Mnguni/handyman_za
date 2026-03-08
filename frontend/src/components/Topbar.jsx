import { useState } from 'react';
import { useEffect, useRef } from 'react';

const Topbar = ({ pageTitle, onMenuClick  }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const notificationsRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='bg-white border-b border-gray-200 h-16 shrink-0 sticky top-0 z-30'>
            <div className='h-full px-4 sm:px-6 flex items-center justify-between'>
                {/* Left section - Page title */}
                <div className='flex items-center'>
                    {/* Hamburger */}
                    <button
                        onClick={onMenuClick}
                        className='p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden mr-3'
                        aria-label='Open sidebar'
                    >
                        <svg
                            className='h-6 w-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='rounded'
                                strokeLinejoin='rounded'
                                strokeWidth={2}
                                d='M4 6h16M4 12h16M4 18h16'
                            />
                        </svg>
                    </button>
                    <h1 className='text-xl font-semibold text-gray-800'>{pageTitle}</h1>
                </div>

                {/* Right section - Actions */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    {/* Search - hidden on mobile, visible on sm and up */}
                    <div className='hidden sm:block'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Search...'
                                className='pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64'
                            />
                            <svg
                                className='absolute left-3 top-2.5 h-4 w-4 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className='relative'>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className='p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative'
                        >
                            <span className='sr-only'>Notifications</span>
                            <svg 
                                className='h-5 w-5 sm:h-6 sm:w-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                                    2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 
                                    0v1a3 3 0 11-6 0v-1m6 0H9'
                                />
                            </svg>
                            <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'></span>
                        </button>

                        <div ref={notificationsRef} className='relative'>
                            {/* Notifications dropdown */}
                            {showNotifications && (
                                <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20'>
                                    <div className='p-4 border-b border-gray-200'>
                                        <h3 className='font-semibold text-gray-800'>Notifications</h3>
                                    </div>
                                    <div className='p-4'>
                                        <p className='text-sm text-gray-600'>No new notifications</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile / Avatar */}
                    <div className='relative'>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className='flex items-center space-x-2 focus:outline-none'>
                            <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center
                            text-white font-semibold'>
                                U
                            </div>
                            <span className='text-sm font-medium text-gray-700 hidden md:block'>User Name</span>
                            <svg
                                className='h-4 w-4 text-gray-500 hidden md:block'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 9l-7 7-7-7'
                                />
                            </svg>
                        </button>

                        <div ref={notificationsRef} className='relative'>
                            {/* Profile dropdown */}
                            {showProfileMenu && (
                                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                                    <div className='py-1'>
                                        <a href='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                            Your Profile
                                        </a>
                                        <a href='/settings' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                            Settings
                                        </a>
                                        <hr className='my-1' />
                                        <button className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;