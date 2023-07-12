var express = require('express');
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
const https = require("https");
const qs = require("querystring");
const checksum_lib = require("./Paytm/checksum");
const config = require("./Paytm/config");
var nm = require('nodemailer');
require("dotenv").config();
//const config = require("config");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL, {
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

app.post("/pay", [parseUrl, parseJson], (req, res) => {
  // Route for making payment
  console.log("body", req.body);
  var paymentDetails = {
    amount: req.body.amount,
    customerId: req.body.name,
    customerEmail: req.body.email,
    customerPhone: req.body.phone
}
if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
    res.status(400).send('Payment failed')
} else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
    params['CUST_ID'] = paymentDetails.customerId;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = '/callback';
    params['EMAIL'] = paymentDetails.customerEmail;
    params['MOBILE_NO'] = paymentDetails.customerPhone;


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
        var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
        //var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
            form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
        }
        form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();
    });
}
});
app.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = '';

  req.on('data', function (data) {
     body += data;
  });

   req.on('end', function () {
     var html = "";
     var post_data = qs.parse(body);

     // received params in callback
     console.log('Callback Response: ', post_data, "\n");


     // verify the checksum
     var checksumhash = post_data.CHECKSUMHASH;
     // delete post_data.CHECKSUMHASH;
     var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
     console.log("Checksum Result => ", result, "\n");


     // Send Server-to-Server request to verify Order Status
     var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};

     checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

       params.CHECKSUMHASH = checksum;
       post_data = 'JsonData='+JSON.stringify(params);

       var options = {
         hostname: 'securegw-stage.paytm.in', // for staging
         //hostname: 'securegw.paytm.in', // for production
         port: 443,
         path: '/merchant-status/getTxnStatus',
         method: 'POST',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
         }
       };


       // Set up the request
       var response = "";
       var post_req = https.request(options, function(post_res) {
         post_res.on('data', function (chunk) {
           response += chunk;
         });

         post_res.on('end', function(){
           console.log('S2S Response: ', response, "\n");

           var _result = JSON.parse(response);
             if(_result.STATUS == 'TXN_SUCCESS') {
                 res.send('payment sucess')
             }else {
                 res.send('payment failed')
             }
           });
       });

       // post the data
       post_req.write(post_data);
       post_req.end();
      });
     });
});


app.post("/login", appController.login_post);
app.post("/register", appController.register_post);
app.post("/addtocart", isAuth, appController.addtocart);
app.post("/cart_items", isAuth, appController.cart_items);
app.post("/remove_item", isAuth, appController.remove_item);
app.post("/addmore", isAuth, appController.addmore);
app.post("/payment", isAuth, appController.payment);
app.post("/brand", isAuth, appController.brand);
app.post("/verify",appController.verify);
app.post("/sendotp", appController.sendotp);
app.post("/updatePassword",appController.updatePassword);


const PORT = process.env.PORT || 5000;
//const PORT = 5000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});