const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Create a new routine
router.post('/', auth, async (req, res) => {
  try {
    const newRoutine = new Routine({
      ...req.body,
      user: req.user.id
    });
    const savedRoutine = await newRoutine.save();
    res.status(201).json(savedRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all routines for a user
router.get('/', auth, async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user.id });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a routine
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedRoutine = await Routine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json(updatedRoutine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a routine
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedRoutine = await Routine.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedRoutine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json({ message: 'Routine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;