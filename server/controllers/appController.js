const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Item = require("../models/items");
const jwt = require('jsonwebtoken');
var nm = require('nodemailer');
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
    
    return res.json({ status: 'wrong username' });
  }

  
  if(password != user.password)
  {
    
    
    return res.json({ status: 'password' });
    
  }
  console.log("posted");
  let id = user._id;

  //console.log("after", id);

  const token = jwt.sign({ id }, 'secretkey');

 // console.log("token", token);
  
    return res.json({ status: 'ok', data: token,name:name })
  
  
  
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { email,name, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

 

  user = new User({
    email,
    name,
    
    password
  });

  await user.save();
  res.redirect(`${process.env.REACT_APP_FRONTEND_LIVE_URL}/login`);
};

exports.addmore = async(req, res, next) => { 
  var { token, id, q } = req.body;    //id=selected item id
  const { uid } = req.uid;
  let t;
  q = parseInt(q);
  console.log('qq', q + 1);
  
    console.log("req.id=", id);
    //var id = req.body.id;

  var _id = uid.id;
  
  

    //console.log("uid", uid);
    console.log("uid", _id);
    
    
    /*Item.updateOne(
      { _id: id },
      { $inc: { quantity: -q } }, function (err, d) {
        if (err) console.warn(err);
        console.log('cart decrment');
        //console.log("id", id);
        //console.log("item info",d);
      }
  );*/
 

  //to find item size in user's cart 
  await User.find({ _id: _id }, function (err, d) {
    console.log("hye from find");
    if (d) {
        
      let f = 0;
      console.log("log", d[0].cart);
      for (var i = 0; i < d[0].cart.length; i++) {
        if (d[0].cart[i].obj == id) {
          f = 1;
          break;

        }
        else
          f = 0;
        
      }
      if (f == 1) {
        console.log('found');
        t = d[0].cart[i].quantity;
        console.log("t", t);
      }
      else {
        
      }
      
      
    }
    else
      console.log('err');

  });
  //console.log("t,q", t, q);

  Item.findById(id, function(err, item) {
    if (err) {
      console.warn(err);
      return;
    }
  
    if (item) {
      item.quantity = (item.quantity + t) - q;
      item.save(function(err, updatedItem) {
        if (err) {
          console.warn(err);
          return;
        }
        
        console.log('cart decrement');
        // console.log("id", id);
        // console.log("item info", updatedItem);
      });
    }
  });
  
  // to update user's cart
  await User.find({ _id: _id }, function (err, d) {
    if (d) {
        
      let f = 0;
      console.log("log", d[0].cart);
      for (var i = 0; i < d[0].cart.length; i++) {
        if (d[0].cart[i].obj == id) {
          f = 1;
          break;

        }
        else
          f = 0;
        
      }
      if (f == 1) {
        console.log('found');
       // t = d[0].cart[i].quantity + q;
        
        User.updateOne({ _id: _id, "cart.obj": id },
          { $set: { "cart.$.quantity": q } }, function (err, dy) {
            
          })

        
        
      }
      else {
        
      }
      
      
    }
    else
      console.log('err');

  });
  
}


exports.addtocart = (req, res, next) => {
  console.log('hye from get_id');
  if (req.status == 'loginfirst') {
    console.log('login first');
    return res.json({ "data": "login" });
    
  }
  else {

    const { token, id, q } = req.body;    //id=selected item id
    const { uid } = req.uid;
  
    console.log("req.id=", id);
    //var id = req.body.id;

    var _id = uid.id;
  

    //console.log("uid", uid);
    console.log("uid", _id);
    
    
    /*Item.updateOne(
      { _id: id },
      { $inc: { quantity: -q } }, function (err, d) {
        if (err) console.warn(err);
        console.log('cart decrment');
        console.log(d);
      }
    );*/

    Item.findOneAndUpdate(
      { _id: id },
      { $inc: { quantity: -1 } },
      function (err, d) {
        if (err) console.warn(err);
        console.log('cart decrement');
        // console.log("id", id);
        // console.log("item info",d);
      }
    );
    
    
    
    //User.find( { cart: { $in: [  ] } }, { _id: _id } )
    User.find({ _id: _id }, function (err, d) {
      if (d) {
        
        let f = 0;
        console.log("log", d[0].cart);
        for (var i = 0; i < d[0].cart.length; i++) {
          if (d[0].cart[i].obj == id) {
            f = 1;
            break;

          }
          else
            f = 0;
          
        }
        if (f == 1) {
          console.log('found');
        
          
        }
        else {
          console.log('not found');
        
        
    

         User.updateOne(
            { _id: _id },
            { $push: { cart: { obj: id, quantity: q } } }, function (err, di) {
              if (err) console.log(err);
              else
                console.log('inserted ');
            }
          )
        
        }
        
        
      }
      else
        console.log('err');
    
      
  })

  
  return res.json({ token: uid })

    
  }
  

  
  
};

exports.cart_items = (req, res) => {
  let items;
  let details;
  if (req.status == 'loginfirst') {
    console.log('login first');
    return res.send({"data":"login"});
    
  }
  
    
  else {
    
    
    let { uid } = req.uid;
    var _id = uid.id;
  
    console.log("_id for cart", _id);
  
  
  
    User.find({ _id: _id }, function (err, allDetails) {
      if (err) {
        console.log(err);
      } else {
        console.log(allDetails);

        items = allDetails[0].cart;
        console.log("items for user", items);
       
        var a = [];
        console.log("length", items.length);
        for (var i = 0; i < items.length; i++)
        {
          a.push(items[i].obj);

          
        }
        console.log("id", a);

    
        Item.find({ _id: { $in: a } }, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
          
          console.log("ii", allDetails);
          
          
          
          }
          res.send({"data":allDetails});
    })

      
      
        
      }
    })
    
    
  }

}

exports.payment = (req, res) => {
  var dat, sum = 0;
  var s;
  var a = [];
  var b = [];
  var c = [];
  var d = [];
  var price = [];
  
  let { uid } = req.uid;
  var _id = uid.id;
  User.find({ _id: _id }, function (err, allDetails) {
    if (err) {
      console.log(err);
    } else {
      console.log(allDetails);

      items = allDetails[0].cart;
      console.log("items for user", items);
     
      
      console.log("length", items.length);
      s = items.length;
      for (var i = 0; i < items.length; i++) {
        a.push(items[i].obj);
        b.push(items[i].quantity);

        
      }
      console.log("id", a);
      console.log('b', b);

  
      Item.find({ _id: { $in: a } }, function (err, allDetails) {
        if (err) {
          console.log(err);
        } else {
          //c.push(allDetails.name);
        
          console.log("ii", allDetails);
          dat=allDetails;
        
        
        }
      
        console.log("dat", dat);
        for (var j = 0; j < dat.length; j++)
        {
          c.push(dat[j].name);
          price.push(dat[j].price);
        
        }
        console.log("c", c);
        for (var i = 0; i < s; i++)
        {
          d.push({ name: c[i], quantity: b[i],price:price[i] });
      
        }
        console.log("d", d);

        for (var i = 0; i < s; i++)
        {
          sum = sum + (b[i] * price[i]);
         // d.push({ name: c[i], quantity: b[i] });
      
        }
        console.log("total", sum);
        
        
        
        res.send({ "data": d, "total":sum});
      })
      
    }

  
  })
  
}

  
exports.remove_item = (req, res) => {

  //remove item from cart
  var q;
  
  const { token, id } = req.body;    //id=selected item id
  const { uid } = req.uid;
  
  console.log("req.id=", id);
  //var id = req.body.id;

  var _id = uid.id;
  
  let t;

  //console.log("uid", uid);
  console.log("uid", _id);

  User.find({ _id: _id }, function (err, d) { 
    if (d)
    {
      let f = 0;
      console.log("log", d[0].cart);
      for (var i = 0; i < d[0].cart.length; i++) {
        if (d[0].cart[i].obj == id) {
          f = 1;
          break;

        }
        else
          f = 0;
        
      }
      if (f == 1) {
        
        t = d[0].cart[i].quantity;
        console.log('t', parseInt(t) + 1);
        Item.updateOne(
          { _id: id},
          { $inc: { quantity:t } },function(err,d){
            if(err) console.warn(err);
            console.log('cart increment',t);
            console.log(d);
          }
        );
        User.updateOne(
          { _id: _id },
          { "$pull": { "cart": { "obj": id } } },
          function (err, del) {
            console.log(del);
            res.send({"data":"good"});
          }
      );
      }
      else {
        
      }

      
    }
    else {
      
    }

  })
};

exports.brand = (req, res) => {
  const { name, brand, min, max } = req.body;
  console.log("name,brand,min,max=", name, brand, min, max);
  if (brand.length != 0 && min != null && max != null) {
    console.log("inside fun1");
  
    Item.find({ name: name, brand: brand, price: { $gte: min, $lte: max } }, function (err, allDetails) {
      if (err) {
        console.log(err);
      }
      else {
        res.send({ "data": allDetails });
      }
    
    })
  }
  else if (brand.length == 0 && (min != null || max != null)) {
    console.log("i am in fun2");
    Item.find({
      price: {
        $gte: min,
        $lte: max
      }
    }, function (err, allDetails) {
      if (err) {
        console.log(err);
      }
      else {
        res.send({ "data": allDetails });
      }
    })
    
    
  }
  else if (brand.length != 0 ) {
    console.log("insidee fun3");
    Item.find({ name: name, brand: brand }, function (err, allDetails) {
      if (err) {
        console.log(err);
      }
      else {
        res.send({ "data": allDetails });
      }
    
    })
    
  }
  else {
    console.log('insode fun4')
    Item.find({ name: name }, function (err, allDetails) {
      if (err) {
        console.log(err);
      }
      else {
        res.send({ "data": allDetails });
      }
    
    })
    
  }

}

let savedOTPS = {

};
var transporter = nm.createTransport(
    {
        service: "gmail",
       
        auth: {
            user: 'prateekvats963@gmail.com',
            pass: 'hixwjkmxxykbrnwt'
        }
    }
);

exports.sendotp = (req, res) => { 
  const { email } = req.body;
  
  // Generate a 4-digit OTP (e.g., using a random number generator)
  const otp = Math.floor(1000 + Math.random() * 9000);
  const token = jwt.sign({ email, otp }, 'secretKey');
  
  // Send the OTP to the provided email address
  const transporter = nm.createTransport({
    service: 'gmail', // e.g., 'Gmail', 'SendGrid', etc.
    auth: {
      user: 'prateekvats963@gmail.com',
      pass: 'hixwjkmxxykbrnwt',
    },
  });

  const mailOptions = {
    from: 'prateekvats963@gmail.com',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ token });
    }
  });

}

exports.verify = (req, res) => {
  const { email, otp, token } = req.body;

  // Verify the JWT token and extract the OTP
  try {
    const decoded = jwt.verify(token, 'secretKey');
    const { email: decodedEmail, otp: decodedOtp } = decoded;

    

    // Perform OTP verification logic (e.g., comparing the provided OTP with the one stored in the JWT)
    if (email==decodedEmail && otp==decodedOtp) {
    
      res.json({ status:200,response: 'OTP verified successfully' });
    } else {
      
      res.json({ response: 'Invalid OTP Enter Again' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ response: 'Invalid token or expired' });
  }

}
 
exports.updatePassword = async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  try {
    const result = await User.updateOne(
      { email: trimmedEmail },
      { $set: { password: trimmedPassword } }
    );
  
    if (result.nModified > 0) {
      console.log("Password updated successfully");
      res.json({ status: 200 });
    } else {
      console.log("User not found or password not updated");
    }
  
    // Rest of your code
  } catch (error) {
    console.error("Error:", error);
    // Handle the error
  }
  /*try {
    const user = await User.findOne({ email:trimmedEmail}).exec();

    if (user) {
      console.log("User found:", user);
      user.password = trimmedPassword;
      user.save();

    } else {
      console.log("User not found");
    }

    // Rest of your code
  } catch (error) {
    console.error("Error:", error);
    // Handle the error
  }*/
};
















