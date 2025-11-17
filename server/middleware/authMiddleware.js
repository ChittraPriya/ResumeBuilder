import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // ✅ Split out the actual token (remove "Bearer ")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    }

    // ✅ Typo fix: `ProcessingInstruction` → `process`
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
