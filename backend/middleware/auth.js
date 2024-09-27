const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token has expired
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (verified.exp && verified.exp < currentTimestamp) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authenticateToken;