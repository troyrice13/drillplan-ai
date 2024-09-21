const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

router.put('/profile', auth, async (req, res) => {
    try {
        const { height, weight, fitnessGoal, preferredWorkoutTypes } = req.body;

        // Find the user by id (assuming the auth middleware adds user id to req)
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update fields
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (fitnessGoal) user.fitnessGoal = fitnessGoal;
        if (preferredWorkoutTypes) user.preferredWorkoutTypes = preferredWorkoutTypes;

        // Save the updated user
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;