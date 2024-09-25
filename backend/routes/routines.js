const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const User = require('../models/User'); // Mongoose User model with embedded routines

module.exports = function(database) {

    // Create a new routine
    router.post('/', auth, async (req, res) => {
        try {
            // Find the user to which the routine will be added
            const user = await database.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const newRoutine = {
                _id: new ObjectId(), // Generate a new unique ObjectId for the routine
                ...req.body,
                createdAt: new Date()
            };

            // Add the new routine to the user's routines array
            const updatedUser = await database.collection('users').findOneAndUpdate(
                { _id: new ObjectId(req.user.userId) },
                { $push: { routines: newRoutine } }, // Push the new routine to the routines array
                { returnDocument: 'after' } // Return the updated document
            );

            res.status(201).json(updatedUser.value.routines.find(routine => routine._id.equals(newRoutine._id))); // Return the newly added routine
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Get all routines for a user
    router.get('/', auth, async (req, res) => {
        try {
            const user = await database.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return an empty array if no routines are found
            res.json(user.routines || []);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Update a routine
    router.put('/:routineId', auth, async (req, res) => {
        try {
            const user = await database.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const routineIndex = user.routines.findIndex(routine => routine._id.equals(new ObjectId(req.params.routineId)));
            if (routineIndex === -1) {
                return res.status(404).json({ message: 'Routine not found' });
            }

            // Update the specific routine in the routines array
            const updatedRoutine = { ...user.routines[routineIndex], ...req.body };
            user.routines[routineIndex] = updatedRoutine;

            // Update the user document with the modified routines array
            const result = await database.collection('users').findOneAndUpdate(
                { _id: new ObjectId(req.user.userId) },
                { $set: { routines: user.routines } },
                { returnDocument: 'after' }
            );

            res.json(result.value.routines[routineIndex]);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Delete a routine
    router.delete('/:routineId', auth, async (req, res) => {
        try {
            const user = await database.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const routineIndex = user.routines.findIndex(routine => routine._id.equals(new ObjectId(req.params.routineId)));
            if (routineIndex === -1) {
                return res.status(404).json({ message: 'Routine not found' });
            }

            // Remove the routine from the array
            user.routines.splice(routineIndex, 1);

            // Update the user document with the modified routines array
            await database.collection('users').findOneAndUpdate(
                { _id: new ObjectId(req.user.userId) },
                { $set: { routines: user.routines } }
            );

            res.json({ message: 'Routine deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};
