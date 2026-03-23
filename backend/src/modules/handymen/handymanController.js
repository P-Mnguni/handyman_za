import User from '../users/user.model.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Get all handymen
 * @route   GET /api/v1/handymen
 * @access  Private/Admin
 */
const getHandymen = async (req, res) => {
    try {
        // Query users with role 'handyman'
        const handymen = await User.find({ role: 'handyman' })
                                    .select('-password')            // Exclude password from response
                                    .sort({ createdAt: -1 })        // Newest first
        
        res.status(200).json(handymen);
    } catch (error) {
        console.error('Error fetching handymen:', error);
        res.status(500).json({
            message: 'Failed to fetch handymen',
            error: error.message
        });
    }
};

/**
 * @desc    Get single handyman by ID
 * @route   GET /api/v1/handymen/:id
 * @access  Private/Admin
 */
const getHandymanByID = async (req, res) => {
    try {
        const handymen = await User.findById(req.params.id)
                                    .select('-password')

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' })
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        res.status(200).json(handyman);
    } catch (error) {
        console.error('Error fetching handyman:', error);
        res.status(500).json({
            message: 'Failed to fetch handyman',
            error: error.message
        });
    }
};

