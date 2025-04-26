const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log(token); // Log the token for debugging
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'hardcoded-secret-key'); // Verify the token with the hardcoded secret key
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};