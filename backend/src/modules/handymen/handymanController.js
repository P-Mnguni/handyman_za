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

/**
 * @desc    Create a new handyman
 * @route   POST /api/v1/handymen
 * @access  Private/Admin
 */
const createHandyman = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            skills,
            location,
            hourlyRate,
            bio
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create handyman user - force role to handyman
        const handyman = new User({
            name,
            email,
            password: hashedPassword,
            role: 'handyman',
            phone: phone || '',
            skills: skills || [],
            location: location || {
                city: '',
                area: ''
            },
            hourlyRate: hourlyRate || null,
            bio: bio || '',
            status: 'pending',                  // waiting for admin approval
            completedJob: 0,
            rating: 0
        });

        await handyman.save();

        // Return handyman without password
        const handymanResponse = handyman.toObject();
        delete handymanResponse.password;

        res.status(201).json({
            message: 'Handyman created successfully',
            handyman: handymanResponse
        });
    } catch (error) {
        console.error('Error creating handyman:', error);
        res.status(500).json({
            message: 'Failed to create handyman',
            error: error.message
        });
    }
};

/**
 * @desc    Update handyman profile
 * @route   PUT /api/v1/handymen/:id
 * @access  Private/Admin
 */
const updateHandyman = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevents role change
        if (updates.role) {
            delete updates.role;
        }

        // Prevent password updates through this endpoint
        if (updates.password) {
            delete updates.password;
        }

        const handyman = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' })
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        res.status(200).json({
            message: 'Handyman updated successfully',
            handyman
        });
    } catch (error) {
        console.error('Error updating handyman:', error);
        res.status(500).json({
            message: 'Failed to update handyman',
            error: error.message
        });
    }
};

/**
 * @desc    Delete handyman
 * @route   DELETE /api/v1/handymen/:id
 * @access  Private/Admin
 */
const deleteHandyman = async (req, res) => {
    try {
        const handyman = await User.findById(req.params.id);

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' });
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        await handyman.deleteOne();

        res.status(200).json({ message: 'Handyman deleted successfully' });
    } catch (error) {
        console.error('Error deleting handyman:', error);
        res.status(500).json({
            message: 'Failed to delete handyman',
            error: error.message
        });
    }
};

/**
 * @desc    Verify handyman (admin approval)
 * @route   POST /api/v1/handymen/:id/verify
 * @access  Private/Admin
 */
const verifyHandyman = async (req, res) => {
    try {
        const handyman = await User.findById(req.params.id);

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' });
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        handyman.status = 'verified';
        await handyman.save();

        res.status(200).json({
            message: 'Handyman verified successfully',
            handyman
        });
    } catch (error) {
        console.error('Error verifying handyman:', error);
        res.status(500).json({
            message: 'Failed to verify handyman',
            error: error.message
        });
    }
};

/**
 * @desc    Suspend handyman
 * @route   POST /api/v1/handymen/:id/suspend
 * @access  Private/Admin
 */
const suspendHandyman = async (req, res) => {
    try {
        const handyman = await User.findById(req.params.id);

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' });
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        handyman.status = 'suspend';
        await handyman.save();

        res.status(200).json({
            message: 'Handyman suspended successfully',
            handyman
        });
    } catch (error) {
        console.error('Error suspending handyman:', error);
        res.status(500).json({
            message: 'Failed to suspend handyman',
            error: error.message
        });
    }
};

/**
 * @desc    Get handyman stats (jobs completed, rating, etc)
 * @route   GET /api/v1/handymen/:id/stats
 * @access  Private/Admin
 */
const getHandymanStats = async (req, res) => {
    try {
        const handyman = await User.findById(req.params.id)
                                    .select('completedJobs ratings name email');

        if (!handyman) {
            return res.status(404).json({ message: 'Handyman not found' });
        }

        if (handyman.role !== 'handyman') {
            return res.status(400).json({ message: 'User is not a handyman' });
        }

        // More stats to be added here 
        // e.g., Total earning, recent jobs, average response time
        // would require querying the Jobs model
        
        res.status(200).json({
            id: handyman._id,
            name: handyman.name,
            email: handyman.email,
            completedJob: handyman.completedJob || 0,
            rating: handyman.rating || 0
        });
    } catch (error) {
        console.error('Error fetching handyman stats:', error);
        res.status(500).json({
            message: 'Failed to reach handyman stats',
            error: error.message
        });
    }
};