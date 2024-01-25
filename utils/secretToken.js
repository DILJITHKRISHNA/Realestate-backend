import env from 'dotenv'
import jwt from 'jsonwebtoken';
env.config()

 const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
export default createSecretToken
