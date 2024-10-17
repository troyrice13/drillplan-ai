const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function(database) {
    const router = express.Router();

    router.post('/register', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const users = database.collection('users');
            
            const existingUser = await users.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            
            const result = await users.insertOne({ username, password: hashedPassword, email });
            res.status(201).json({ message: 'User registered successfully!', userId: result.insertedId });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const users = database.collection('users');
            const user = await users.findOne({ username });
            
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const expiresIn = '7d';
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: expiresIn,
            });
            
            res.json({ 
                token, 
                user: { username: user.username, email: user.email },
                expiresIn: 7 * 24 * 60 * 60 * 1000
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });

    return router;
};