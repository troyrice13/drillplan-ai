const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { ObjectId } = require('mongodb');

module.exports = function(database) {
    // Create a new routine
    router.post('/', authenticateToken, async (req, res) => {
        try {
            const { name, exercises } = req.body;
            const newRoutine = {
                name,
                exercises,
                userId: new ObjectId(req.user.userId),
                createdAt: new Date()
            };

            const result = await database.collection('routines').insertOne(newRoutine);
            res.status(201).json({ ...newRoutine, _id: result.insertedId });
        } catch (error) {
            console.error('Error creating routine:', error);
            res.status(500).json({ message: 'Error creating routine', error: error.message });
        }
    });

    // Get all routines for a user
    router.get('/', authenticateToken, async (req, res) => {
        try {
            const routines = await database.collection('routines')
                .find({ userId: new ObjectId(req.user.userId) })
                .toArray();
            res.json(routines);
        } catch (error) {
            console.error('Error fetching routines:', error);
            res.status(500).json({ message: 'Error fetching routines', error: error.message });
        }
    });

    // Update a routine
    router.put('/:routineId', authenticateToken, async (req, res) => {
        try {
            const { name, exercises } = req.body;
            const result = await database.collection('routines').findOneAndUpdate(
                { _id: new ObjectId(req.params.routineId), userId: new ObjectId(req.user.userId) },
                { $set: { name, exercises, updatedAt: new Date() } },
                { returnDocument: 'after' }
            );

            if (!result.value) {
                return res.status(404).json({ message: 'Routine not found or not authorized' });
            }

            res.json(result.value);
        } catch (error) {
            console.error('Error updating routine:', error);
            res.status(500).json({ message: 'Error updating routine', error: error.message });
        }
    });

    // Delete a routine
    router.delete('/:routineId', authenticateToken, async (req, res) => {
        try {
            const result = await database.collection('routines').deleteOne({
                _id: new ObjectId(req.params.routineId),
                userId: new ObjectId(req.user.userId)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Routine not found or not authorized' });
            }

            res.json({ message: 'Routine deleted successfully' });
        } catch (error) {
            console.error('Error deleting routine:', error);
            res.status(500).json({ message: 'Error deleting routine', error: error.message });
        }
    });

    return router;
};