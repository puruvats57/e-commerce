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
    
    return res.json({ status: 'wrong username' });
  }

  
  if(password != user.password)
  {
    
    
    return res.json({ status: 'password' });
    
  }
  console.log("posted");
  let id = user._id;

  //console.log("after", id);

  const token = jwt.sign({ id }, 'secretkey', { expiresIn: "2h" });

 // console.log("token", token);
  
    return res.json({ status: 'ok', data: token,name:name })
  
  
  
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

exports.addmore = (req, res, next) => { 
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
    
    
    Item.updateOne(
      { _id: id },
      { $inc: { quantity: -q } }, function (err, d) {
        if (err) console.warn(err);
        console.log('cart decrment');
        console.log(d);
      }
  );
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
        t = d[0].cart[i].quantity + q;
        
        User.updateOne({ _id: _id, "cart.obj": id },
          { $inc: { "cart.$.quantity": +q } }, function (err, dy) {
            
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
    
    
    Item.updateOne(
      { _id: id },
      { $inc: { quantity: -q } }, function (err, d) {
        if (err) console.warn(err);
        console.log('cart decrment');
        console.log(d);
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
          { $inc: { quantity: t } },function(err,d){
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











