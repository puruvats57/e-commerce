
const jwt = require("jsonwebtoken");



exports.isAuth = (req, res, next) => {

  const { token, id } = req.body;

  console.log("isauth", token);
  //const token = req.body.token;
  //const token = req.body.t;

    // CHECK IF WE EVEN HAVE A TOKEN
  if (!token) {
    console.log("not found");
        res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })
    }

    
  const uid = jwt.verify(token, "secretkey");
  console.log("uid",uid);
  req.body = { uid, id };
  next();

  
};
