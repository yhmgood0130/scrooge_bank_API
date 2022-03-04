const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const hashPassword = (user: any) => {
  const saltRound = 10;
  return bcrypt.hash(user.password, saltRound)
    .then(hash => {
      user.password = hash;
      return user;
    })
};

const hashSyncPassword = password => {
  const saltRound = 10;
  return bcrypt.hashSync(password, saltRound);
}
const generateJWT = user => {
  delete user.password;
  return jwt.sign(user,process.env.TOKEN_SECRET)
}
const comparePassword = (password,user) => {
  const valid = bcrypt.compareSync(password, user.password);
  
  if(valid){
    return user;
  } else {
    throw new Error('Incorrect email or password');
  }
}
const authorize = (req, res, next) => {  
  if (req.user && req.params.id && req.user.customer_id == req.params.id) {
    next();
  } else {
    res.status(401);
    res.json({error: 'Unathorized'});
  }
}
const authorizeAccount = (req, res, next) => {  
  console.log(req.user);
  console.log(req.body);
  console.log(req.params);
  
  
  if (req.user && req.params.id && 
    req.user.account_id == req.body.account_id && 
    req.user.customer_id == req.params.id) {
    next();
  } else {
    res.status(401);
    res.json({error: 'Unathorized'});
  }
}
const token = (req,res,next) => {
  const authHeader = req.headers.authorization;  
  if (authHeader){
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
  }
  next()
}

export {
  hashPassword,
  hashSyncPassword,
  generateJWT,
  comparePassword,
  authorize,
  authorizeAccount,
  token
}