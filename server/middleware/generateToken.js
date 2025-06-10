import jwt from 'jsonwebtoken';

console.log(process.env.JWT_SECRET)

const JWT_SECRET = process.env.JWT_SECRET || '1bb06b1a29b8b50339f61e4444cbd71a334ddd50dc312b75bd5aef91656197361994d3b91aa3809227d378c46f5c2729e5a72ad60617359317b1f545c764b4a6';

const generateToken = (user, res = null) => {
  if (!user || !user.email) {
    throw new Error('Invalid user data: email is required.');
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '10d' }
  );


  return token;
};

export default generateToken;