const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

module.exports = function(database) {

    // Create a new routine
    router.post('/', auth, async (req, res) => {
        try {
            const newRoutine = {
                ...req.body,
                user: new ObjectId(req.user.userId) // Link routine to the authenticated user
            };
            const result = await database.collection('routines').insertOne(newRoutine);
            res.status(201).json(result.ops[0]); // Respond with the created routine
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Get all routines for a user
    router.get('/', auth, async (req, res) => {
        try {
            const routines = await database.collection('routines').find({
                user: new ObjectId(req.user.userId)
            }).toArray();
            res.json(routines);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Update a routine
    router.put('/:id', auth, async (req, res) => {
        try {
            const updatedRoutine = await database.collection('routines').findOneAndUpdate(
                { _id: new ObjectId(req.params.id), user: new ObjectId(req.user.userId) },
                { $set: req.body },
                { returnDocument: 'after' } // Returns the updated document
            );
            if (!updatedRoutine.value) {
                return res.status(404).json({ message: 'Routine not found' });
            }
            res.json(updatedRoutine.value);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Delete a routine
    router.delete('/:id', auth, async (req, res) => {
        try {
            const deletedRoutine = await database.collection('routines').findOneAndDelete({
                _id: new ObjectId(req.params.id), 
                user: new ObjectId(req.user.userId)
            });
            if (!deletedRoutine.value) {
                return res.status(404).json({ message: 'Routine not found' });
            }
            res.json({ message: 'Routine deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};
