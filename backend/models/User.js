const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        weight: Number
    }],
    createdAt: { type: Date, default: Date.now },
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
    routines: [routineSchema] // Embed routines here
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
