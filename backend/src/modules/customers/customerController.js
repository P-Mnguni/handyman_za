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

/**
 * @desc    Get single customer by ID
 * @route   GET /api/v1/customers/:id
 * @access  Private/Admin
 */
export const getCustomerById = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id)
                                    .select('-password');

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        if (customer.role !== 'client') {
            return res.status(400).json({
                success: false,
                message: 'User is not a customer'
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
};