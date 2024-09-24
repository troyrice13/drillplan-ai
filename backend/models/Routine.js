const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    time: Number,
});

const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'My Workout'
    },
    exercises: [ExerciseSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Routine', RoutineSchema)