import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '1bb06b1a29b8b50339f61e4444cbd71a334ddd50dc312b75bd5aef91656197361994d3b91aa3809227d378c46f5c2729e5a72ad60617359317b1f545c764b4a6'; 

 export const verifyRoutes = (req, res, next) => {
 const token = req.headers.authorization || req.cookies.token;
 console.log(token)
  if (!token) {
    return res.status(403).json({ message: 'Unauthonticated User' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    req.user = decoded;
    
    next(); 
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

