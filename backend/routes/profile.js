const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { ObjectId } = require('mongodb');

module.exports = function(database) {
    router.get('/', authenticateToken, async (req, res) => {
        try {
            console.log('Attempting to find user with ID:', req.user.userId);

            const user = await database.collection('users').findOne(
                { _id: new ObjectId(req.user.userId) },
                { projection: { password: 0 } }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Detailed error in profile route:', error);
            if (error.name === 'MongoNetworkError') {
                res.status(503).json({ 
                    message: 'Database operation timed out. Please try again.',
                    details: error.message
                });
            } else {
                res.status(500).json({ 
                    message: 'An unexpected error occurred', 
                    error: error.message,
                    stack: error.stack
                });
            }
        }
    });

    router.put('/', authenticateToken, async (req, res) => {
        try {
            const { email, height, weight, fitnessGoal } = req.body;
            const userId = req.user.userId;

            const updateResult = await database.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                { $set: { email, height, weight, fitnessGoal } }
            );

            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (updateResult.modifiedCount === 0) {
                return res.status(200).json({ message: 'No changes were made to the profile' });
            }

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ 
                message: 'An error occurred while updating the profile', 
                error: error.message 
            });
        }
    });

    return router;
};