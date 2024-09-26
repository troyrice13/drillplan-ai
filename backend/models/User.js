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
    routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;