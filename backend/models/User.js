const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1
    },
    reps: {
        type: Number,
        required: true,
        min: 1
    },
    weight: {
        type: Number,
        min: 0
    }
});

const routineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    exercises: [exerciseSchema]
}, {
    timestamps: true
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    height: {
        type: Number,
        min: 0,
    },
    weight: {
        type: Number,
        min: 0,
    },
    fitnessGoal: {
        type: String,
        enum: ['muscle growth', 'lean muscle', 'weight loss', 'general fitness'],
    },
    preferredWorkoutTypes: [{
        type: String,
    }],
    routines: [routineSchema]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;