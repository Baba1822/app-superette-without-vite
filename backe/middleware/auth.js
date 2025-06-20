const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Veuillez vous authentifier.' });
    }
};

module.exports = auth;
