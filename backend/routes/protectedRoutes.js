const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
