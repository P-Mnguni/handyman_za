import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Jobs from '../pages/Jobs';
import DashboardHome from '../pages/DashboardHome';
import Handymen from '../pages/Handyman';

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

const Customers = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <p className="text-gray-600">Manage customer accounts and job history.</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⏱️ Placeholder: Customers management coming soon...</p>
        </div>
    </div>
)


const Payments = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p className="text-gray-600">Track all transactions, payouts, and revenue.</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⏱️ Placeholder: Payments dashboard coming soon...</p>
        </div>
    </div>
)


const Reviews = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Reviews</h1>
        <p className="text-gray-600">Monitor and manage all reviews left by customers.</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⏱️ Placeholder: Reviews management coming soon...</p>
        </div>
    </div>
)


const Reports = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p className="text-gray-600">Generate and view platform analytics abd reports.</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⏱️ Placeholder: Reports coming soon...</p>
        </div>
    </div>
)


const Settings = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600">Configure platform settings and preferences.</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⏱️ Placeholder: Settings coming soon...</p>
        </div>
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
                        <Route index element={<DashboardHome />} />

                        {/* Nested routes - match the nav items in DashboardLayout */}
                        <Route path='dashboard' element={<DashboardHome />} />
                        <Route path='jobs' element={<Jobs />} />
                        <Route path='handymen' element={<Handymen />} />
                        <Route path='customers' element={<Customers />} />
                        <Route path='payments' element={<Payments />} />
                        <Route path='reviews' element={<Reviews />} />
                        <Route path='reports' element={<Reports />} />
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