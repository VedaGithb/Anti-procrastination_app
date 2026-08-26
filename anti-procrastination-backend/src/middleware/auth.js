import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'token is required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized', error: err });
    }
};

export default auth;