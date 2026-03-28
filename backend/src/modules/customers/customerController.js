import { success } from "zod";
import User from "../users/user.model.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Get all customers (users with role 'client')
 * @route   GET /api/v1/customers
 * @access  Private/Admin
 */
export const getCustomers = async (req, res) => {
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

/**
 * @desc    Create a new customer (client)
 * @route   POST /api/v1/customers
 * @access  Private/Admin
 */
export const createCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            location
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create customer user - force role to 'client'
        const customer = new User({
            name,
            email,
            password: hashedPassword,
            role: 'client',
            phone: phone || '',
            location: location || {
                city: '',
                area: ''
            },
            status: 'active',
            completedJobs: 0,
            totalSpent: 0
        });

        await customer.save();

        // Return customer without password
        const customerResponse = customer.toObject();
        delete customerResponse.password;

        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customerResponse
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
        });
    }
};

/**
 * @desc    Update customer profile
 * @route   PUT /api/v1/customers/:id
 * @access  Private/Admin
 */
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent role changes
        if (updates.role) {
            delete updates.role;
        }

        // Prevent password updates through this endpoint
        if (updates.password) {
            delete updates.password;
        }

        const customer = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

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
            message: 'Customer updated successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error.message
        });
    }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/v1/customers/:id
 * @access  Private/Admin
 */
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);

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

        await customer.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error.message
        });
    }
};

/**
 * @desc    Suspend customer account
 * @route   POST /api/v1/customers/:id/suspend
 * @access  Private/Admin
 */
export const suspendCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);

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

        customer.status = 'suspended';
        await customer.save();

        res.status(200).json({
            success: true,
            message: 'Customer suspended successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error suspending customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to suspend customer',
            error: error.message
        });
    }
};

/**
 * @desc    Activate customer account
 * @route   POST /api/v1/customers/:id/activate
 * @access  Private/Admin
 */
export const activateCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);

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

        customer.status = 'active';
        await customer.save();

        res.status(200).json({
            success: true,
            message: 'Customer activated successfully',
            data: customer
        });
    } catch (error) {
        console.error('Error activating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to activate customer',
            error: error.message
        });
    }
};

/**
 * @desc    Get customer stats (total spent, total count, etc.)
 * @route   GET /api/v1/customers/:id/stats
 * @access  Private/Admin
 */
export const getCustomerStats = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id)
                                    .select('completedJobs totalSpent name email location');

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
            data: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                completedJobs: customer.completedJobs || 0,
                totalSpent: customer.totalSpent || 0,
                location: customer.location
            }
        });
    } catch (error) {
        console.error('Error fetching customer stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer stats',
            error: error.message
        });
    }
};

/**
 * @desc    Get customer's job history
 * @route   GET /api/v1/customers/:id/jobs
 * @access  Private/Admin
 */
export const getCustomerJobs = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        // Import Job model
        const { Job } = require('../jobs/job.model.js');

        // Build query
        const query = { client: id };
        if (status) {
            query.status = status;
        }

        const jobs = await Job.find(query)
                                .populate('handyman', 'name email')
                                .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Error fetching customer jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer jobs',
            error: error.message
        });
    }
};