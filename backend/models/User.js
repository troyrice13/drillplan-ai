const mongoose = require('mongoose');

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
    // New fields
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
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);