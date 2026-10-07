import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'freelancer_super_secret_jwt_key_2026_secure', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken;
