const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const authenticateToken = require('../middleware/auth');

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
            const routineId = new ObjectId(req.params.routineId);
            const userId = new ObjectId(req.user.userId);
    
            // Log the incoming data for debugging
            console.log('Updating routine with ID:', routineId);
            console.log('Authenticated user ID:', userId);
            console.log('Update data received:', req.body);
    
            // Check if the routine exists and belongs to the user
            const existingRoutine = await database.collection('routines').findOne({
                _id: routineId,
                userId: userId
            });
    
            if (!existingRoutine) {
                console.log('Routine not found or not authorized.');
                return res.status(404).json({ message: 'Routine not found or not authorized' });
            }
    
            // Remove _id, userId, and createdAt from the update data if not needed
            const { _id, userId: _, createdAt, ...updateData } = req.body;
    
            // Log the data to be updated in the database for clarity
            console.log('Data to update in DB:', updateData);
    
            // Update the routine in the database and use modifiedCount to verify the update
            const result = await database.collection('routines').updateOne(
                { _id: routineId, userId: userId },
                { $set: { ...updateData, updatedAt: new Date() } }
            );
    
            if (result.modifiedCount === 0) {
                console.log('Routine update failed, no document found or modified.');
                return res.status(500).json({ message: 'Failed to update routine' });
            }
    
            console.log('Routine updated successfully:', result);
            // Send a success response
            res.json({ message: 'Routine updated successfully', ...updateData });
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