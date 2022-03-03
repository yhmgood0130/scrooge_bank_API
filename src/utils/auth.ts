const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

export const hashPassword = (user: any) => {
  const saltRound = 10;
  return bcrypt.hash(user.password, saltRound)
    .then(hash => {
      user.password = hash;

      return user;
    })
};

export const hashSyncPassword = password => {
  const saltRound = 10;
  return bcrypt.hashSync(password, saltRound);
}
export const generateJWT = user => {
  delete user.password;
  return jwt.sign(user,process.env.TOKEN_SECRET)
}
export const comparePassword = (password,user) => {
  const valid = bcrypt.compareSync(password, user.password);
  
  if(valid){
    return user;
  } else {
    throw new Error('Incorrect email or password');
  }
}
export const authorize = (req, res, next) => {  
  if (req.user && req.params.id && req.user.customer_id == req.params.id) {
    next();
  } else {
    res.status(401);
    res.json({error: 'Unathorized'});
  }
}
export const token = (req,res,next) => {
  const authHeader = req.headers.authorization;  
  if (authHeader){
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
  }
  next()
}