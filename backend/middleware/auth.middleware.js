//backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden" + error.message });
    }
};
