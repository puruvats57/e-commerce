const bcrypt = require("bcryptjs");


const User = require("../models/User");
const Item = require("../models/items");
const jwt = require('jsonwebtoken');





let uid;

exports.landing_page = (req, res) => {
  res.render("landing");
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};


exports.login_post = async (req, res) => {

  console.log("lets post");
  console.log(req.body);
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (!user) {
    req.session.error = "Invalid Credentials";
    return res.redirect("http://127.0.0.1:3000/login");
  }

  
  if(password != user.password)
  {
    req.session.error = "Invalid Credentials";
    return res.redirect("http://127.0.0.1:3000/login");
    
  }
  console.log("posted");
  let id = user._id;

  //console.log("after", id);

  const token = jwt.sign({ id }, 'secretkey', { expiresIn: "1h" });

 // console.log("token", token);

  return res.json({ status: 'ok', data: token })
  //res.redirect("http://127.0.0.1:3000/");
  
  /*res.cookie("token", token, {
    httpOnly: true,
  });*/
    //console.log(token);
    //req.cookies.token = token;



    //console.log("cookie = ", req.cookies.token);
    

  

  //const token = jwt.sign({ _id: user._id }, "secretkey");
  //console.log("token",token);

  //req.session.isAuth = true;
  
  //req.uid = user._id;

  //res.send(req.cookies.token);
  //res.redirect("http://127.0.0.1:3000/");
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { name, password } = req.body;

  let user = await User.findOne({ name });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

 

  user = new User({
    name,
    
    password
  });

  await user.save();
  res.redirect("http://127.0.0.1:3000/login");
};



exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("http://127.0.0.1:3000/login");
  });
};


exports.get_id = (req, res, next) => {

  const { uid, id } = req.body;
  
  console.log("req.id=", id);
  //var id = req.body.id;

  var _id = uid.id;
  

  //console.log("uid", uid);
  //console.log("uid", uid);
  User.updateOne( { "_id" : "627a50d293943e21103cd709" },{ $push: { "cart": 95 } });


  //return res.send(req.body.id);
  return res.json({ token: uid })
  
};




/*exports.cart = (req, res) => {
  const { uid,id }= req.body;
 console.log("cart uid", uid);

  //console.log("uid", uid);
  //console.log("uid", uid);
  User.updateMany(
    { _id: uid },
    {$push:{"cart":id}}
  )
  

};*/
