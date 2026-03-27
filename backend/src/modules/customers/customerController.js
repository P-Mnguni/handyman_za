import { success } from "zod";
import User from "../users/user.model";
import bcrypt from "bcryptjs";

/**
 * @desc    Get all customers (users with role 'client')
 * @route   GET /api/v1/customers
 * @access  Private/Admin
 */
const getCustomers = async (req, res) => {
    try {
        // Query users with role 'client'
        const customers = await User.find({ role: 'client' })
                                    .select('-password')
                                    .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};