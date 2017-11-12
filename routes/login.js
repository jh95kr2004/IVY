var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/IVY";

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").find({email:email, password:password}).toArray(function(err, result) {
      if(err) throw err;
      if(result.length == 0) res.layout('layout', {title:"IVY: Sign in", head:""}, {body:{block:"login", data:{description:"<font color='red'>Incorrect email or password. Try again or contact the administrator.</font>"}}});
      else {
        req.session.user = {
          email: email,
          permission: result[0].permission,
          authorized: true
        }
        if(req.session.user.permission == 'administrator') res.redirect('../admin');
        else if(req.session.user.permission == 'consultant') res.redirect('../consult');
      }
      db.close();
    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    if(req.session.user.permission == 'administrator') res.redirect('../admin');
    else if(req.session.user.permission == 'consultant') res.redirect('../consult');
  }
  else
    res.layout('layout', {title:"IVY: Sign in", head:""}, {body:{block:"login", data:{description:"Sign in to your pre-registered consulter account."}}});
});

module.exports = router;
