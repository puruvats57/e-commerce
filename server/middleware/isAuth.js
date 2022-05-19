
const jwt = require("jsonwebtoken");



exports.isAuth = (req, res, next) => {

  const { token} = req.body;

  console.log("isauth", token);
  //const token = req.body.token;
  //const token = req.body.t;

    // CHECK IF WE EVEN HAVE A TOKEN
  if (!token) {
    console.log("not found");
    req.status = "loginfirst";
    next();
    }

    
  const uid = jwt.verify(token, "secretkey");
  console.log("uid from auth",uid);
  req.uid = { uid };
  next();

  
};
