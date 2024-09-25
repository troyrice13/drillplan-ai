const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const User = require('../models/User'); // Mongoose User model with embedded routines

// Add a new routine to the user's routines array
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add routine to user's routines array
        const newRoutine = {
            name: req.body.name,
            exercises: req.body.exercises
        };
        user.routines.push(newRoutine);

        // Save user document
        await user.save();
        res.status(201).json(user.routines[user.routines.length - 1]); // Return the newly added routine
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all routines for a user
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.routines); // Return the user's routines
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a specific routine by its ID
router.put('/:routineId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the routine to update
        const routine = user.routines.id(req.params.routineId);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        // Update the routine fields
        routine.name = req.body.name || routine.name;
        routine.exercises = req.body.exercises || routine.exercises;

        // Save the updated user document
        await user.save();
        res.json(routine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a specific routine by its ID
router.delete('/:routineId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the routine by its ID
        const routine = user.routines.id(req.params.routineId);
        if (!routine) {
            return res.status(404).json({ message: 'Routine not found' });
        }

        routine.remove(); // Remove the routine from the array
        await user.save(); // Save the user document after removal
        res.json({ message: 'Routine deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
