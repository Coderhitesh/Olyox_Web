const jwt = require('jsonwebtoken');

const Protect = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = Protect;