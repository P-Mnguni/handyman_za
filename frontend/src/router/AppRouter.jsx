import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

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

const Dashboard = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>
    </div>
)

const Jobs = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <p className="text-gray-600">Manage your jobs here.</p>
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

