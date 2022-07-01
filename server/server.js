var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const axios = require('axios');
var Item = require('./models/items');
const appController = require("./controllers/appController");
const { isAuth } = require("./middleware/isAuth");
const jwt = require('jsonwebtoken');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const { signedCookies } = require('cookie-parser');
//const config = require("config");


app.use(cookieParser());




app.use(cors());







app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.json());
//app.use(express.urlencoded());





mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  uid:""
  //session expires after 3 hours
  

}));


app.get('/fetch',function(req,res) {
  console.log("item ",req.body.search);
  let search=req.body.search;
  Item.find({}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
      console.log(allDetails);
      
        res.send({"data":allDetails});
    }
})

});

app.post('/fetch', function (req, res) {
  var brand = new Set([]);
  console.log("item name",req.body.search);
  let search=req.body.search;
  Item.find({name:search}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
      console.log("all details", allDetails);
     // console.log("brand", allDetails[0].brand);

      for (var i = 0; i < allDetails.length; i++)
      {
        brand.add(allDetails[i].brand);
        

      }
      //console.log("brands", brand);
      var a = [];
      for (var it = brand.values(), val= null; val=it.next().value; ) {
        //console.log("brand", val);
        a.push(val);
      }
      console.log("brands", a);

      var b = [];
      for (var i = 0; i < allDetails.length; i++)
      {
        b.push(allDetails[i].price);
        
      }
      console.log("b", b);
      var min = Math.min.apply(null, b);
      var max = Math.max.apply(null, b);
      console.log("min,max", min, max);
      
        res.send({"data":allDetails,"brands":a,"min":min,"max":max});
    }
})

});

app.post("/login", appController.login_post);

app.post("/register", appController.register_post);

//app.post("/cart", appController.cart);



app.post("/addtocart", isAuth, appController.addtocart);
app.post("/cart_items", isAuth, appController.cart_items);
app.post("/remove_item", isAuth, appController.remove_item);
app.post("/addmore", isAuth, appController.addmore);
app.post("/payment", isAuth, appController.payment);
app.post("/brand", isAuth, appController.brand);

  
  
  

  
  


  





const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});