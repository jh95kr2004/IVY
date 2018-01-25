var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/IVY";

var authenticate = function(req, res, next) {
  if(req.session.user) next();
  else res.redirect('/login');
}

router.get('/', authenticate, function(req, res, next) {
  var nav = "";
  if(req.session.user.permission == 'administrator') nav = '<li class="nav-item"><a class="nav-link" href="/admin">CONSULTANTS</a></li><li class="nav-item"><a class="nav-link" href="/admin/highschool">HIGH SCHOOLS</a></li>';
  else if(req.session.user.permission == 'consultant') nav = '<li class="nav-item"><a class="nav-link" href="/consult">DASHBOARD</a></li>';
  res.layout('layout', {title: "IVY: Account", head: '<script src="/javascripts/account.js"></script>'}, {body: {block: "account", data: {nav: nav}}});
});


router.post('/save', authenticate, function(req, res, next) {
  if(req.body.newPassword != req.body.newPasswordConfirm) res.send("Confirm password is different from new password.");
  else {
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("accounts").updateOne(
        {email: req.session.user.email, password: req.body.currentPassword},
        {$set: {password: req.body.newPassword}},
        function(err, object) {
          if(err) throw(err);
          console.log(err, object);
          if(object.result.n != 1) res.send("You wrote wrong current password.");
          else res.send("0");
        });
    });
  }
});

router.get('/highschool', authenticate, function(req, res, next) {
  var keyword = req.query.keyword;
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("highschools").find({$or: [{name: { "$regex": keyword, "$options": "i"}}, {location: { "$regex": keyword, "$options": "i"}}]}).toArray(function(err, result) {
      res.send(result);
    });
  });
});

module.exports = router;
