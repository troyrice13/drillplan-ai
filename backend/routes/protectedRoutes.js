const express = require('express');
const authenticateToken = require('../middleware/auth');

module.exports = function(database) {
    const router = express.Router();

    // Protected route for user profile
    router.get('/profile', authenticateToken, async (req, res) => {
        try {
            const users = database.collection('users');
            const user = await users.findOne({ _id: req.user.userId });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Exclude sensitive information like password
            const { password, ...userProfile } = user;
            res.json(userProfile);
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // Protected route for user's routines
    router.get('/routines', authenticateToken, async (req, res) => {
        try {
            const routines = database.collection('routines');
            const userRoutines = await routines.find({ userId: req.user.userId }).toArray();
            res.json(userRoutines);
        } catch (error) {
            console.error('Error fetching routines:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // Add a new routine (protected)
    router.post('/routines', authenticateToken, async (req, res) => {
        try {
            const { name, exercises } = req.body;
            const routines = database.collection('routines');
            const result = await routines.insertOne({
                name,
                exercises,
                userId: req.user.userId,
                createdAt: new Date()
            });
            res.status(201).json({ message: 'Routine created successfully', routineId: result.insertedId });
        } catch (error) {
            console.error('Error creating routine:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    // You can add more protected routes here as needed

    return router;
};