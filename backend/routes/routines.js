const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const authenticateToken = require('../middleware/auth');

module.exports = function(database) {

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

    router.put('/:routineId', authenticateToken, async (req, res) => {
        try {
            const routineId = new ObjectId(req.params.routineId);
            const userId = new ObjectId(req.user.userId);
    
            console.log('Updating routine with ID:', routineId);
            console.log('Authenticated user ID:', userId);
            console.log('Update data received:', req.body);
    
            const existingRoutine = await database.collection('routines').findOne({
                _id: routineId,
                userId: userId
            });
    
            if (!existingRoutine) {
                console.log('Routine not found or not authorized.');
                return res.status(404).json({ message: 'Routine not found or not authorized' });
            }
    
  
            const { _id, userId: _, createdAt, ...updateData } = req.body;
    
            console.log('Data to update in DB:', updateData);
    
            const result = await database.collection('routines').updateOne(
                { _id: routineId, userId: userId },
                { $set: { ...updateData, updatedAt: new Date() } }
            );
    
            if (result.modifiedCount === 0) {
                console.log('Routine update failed, no document found or modified.');
                return res.status(500).json({ message: 'Failed to update routine' });
            }
    
            console.log('Routine updated successfully:', result);
            res.json({ message: 'Routine updated successfully', ...updateData });
        } catch (error) {
            console.error('Error updating routine:', error);
            res.status(500).json({ message: 'Error updating routine', error: error.message });
        }
    });
    
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