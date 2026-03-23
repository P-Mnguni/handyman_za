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