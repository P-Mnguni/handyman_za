import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Jobs from '../pages/Jobs';

// Temporary placeholders (will be replaced with real pages later)
const Login = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Login Page</h1>
            <p className="text-gray-600">Coming Soon...</p>
        </div>
    </div>
)

const Register = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Register Page</h1>
            <p className="text-gray-600">Coming Soon...</p>
        </div>
    </div>
)

const Messages = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p className="text-gray-600">Your conversations will appear here.</p>
    </div>
)

const Profile = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600">Your profile information.</p>
    </div>
)

const Settings = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">Application settings.</p>
    </div>
)

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className='h-screen'>
                <Routes>
                    {/* Public routes - no layout */}
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    {/* Protected routes - with DashboardLayout */}
                    <Route path='/' element={<DashboardLayout />}>
                        {/* Index route shows Dashboard at */}
                        <Route index element={<Dashboard />} />

                        {/* Nested routes - match the nav items in DashboardLayout */}
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='jobs' element={<Jobs />} />
                        <Route path='messages' element={<Messages />} />
                        <Route path='profile' element={<Profile />} />
                        <Route path='settings' element={<Settings />} />

                        {/* Catch-all for unmatched routes */}
                        <Route path='*' element={
                            <div className='text-center py-10'>
                                <h2 className='text-2xl font-bold text-gray-800'>404</h2>
                                <p className='text-gray-600'>Page not found</p>
                            </div>
                        } />
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default AppRouter