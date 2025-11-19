import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Get token from 'Bearer<token>'
    const token = authHeader.split(' ')[1];
    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    // }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //save userId correctly
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
