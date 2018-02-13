var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/IVY";

var validator = require('validator');

var authenticate = function(req, res, next) {
  if(req.session.user) {
    if(req.session.user.permission != 'administrator')
      res.layout('layout', {title:"IVY: No permission", head:""}, {body:{block:"caution", data:{title: "No Permission", description:"You don't have a permission to access administrator service."}}});
    else
      next();
  }
  else
    res.redirect('/login');
}

router.get('/', authenticate, function(req, res, next) {
  var consultantsListHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").find({permission:"consultant"}).sort({name: -1}).toArray(function(err, result) {
      for(let consultant of result)
        consultantsListHtml += "<tr><td>" + consultant.name + "</td><td>" + consultant.email + "</td><td class='code'>" + consultant._id + "</td></tr>";
      db.close();
      res.layout('layout', {title:"IVY: Administrator", head:'<script src="/javascripts/admin/consultants.js"></script>'}, {body:{block:"admin/consultants", data:{consultants: consultantsListHtml}}});
    });
  });
});

router.get('/new', authenticate, function(req, res, next) {
  res.layout('layout', {title:"IVY: New Consultant", head:'<script src="/javascripts/admin/new_consultant.js"></script>'}, {body:{block:"admin/new_consultant"}});
});

router.post('/new', authenticate, function(req, res, next) {
  if(req.body.name.length == 0 || req.body.email.length == 0 || validator.isEmail(req.body.email) == false)
    res.json({ status: 0, url: "You entered wrong data. Please check and re-try." });
  else {
    var account = { name: req.body.name, email: req.body.email, password: "123", permission: "consultant", students: [] };
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("accounts").findOne({ email: req.body.email }, function(err, result) {
        if(err) throw err;
        if(result != null) {
          db.close();
          res.json({ status: -1, message: "This email is already used. Try another email address." });
        } else {
          db.collection("accounts").insertOne(account, function(err, result) {
            if(err) throw err;
            db.close();
            res.json({ status: 1, url: "Added new consultant successfully!" });
          });
        }
      });
    });
  }
});

router.post('/remove', authenticate, function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").remove({ _id: new ObjectID(req.body.consultantId) }, function(err, result) {
      if(err) throw err;
      db.close();
      res.send("1");
    });
  });
});

router.get('/highschools', authenticate, function(req, res, next) {
  var highschoolsListHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("highschools").find().sort({name: -1}).toArray(function(err, result) {
      for(let highschool of result)
        highschoolsListHtml += "<tr><td>" + highschool.name + "</td><td>" + highschool.location + "</td><td class='code'>" + highschool._id +"</td></tr>";
      db.close();
      res.layout('layout', {title:"IVY: Administrator", head:""}, {body:{block:"admin/highschools", data:{highschools: highschoolsListHtml}}});
    });
  });
});

router.get('/highschools/new', authenticate, function(req, res, next) {
  res.layout('layout', {title:"IVY: New High School", head:'<script src="/javascripts/admin/new_highschool.js"></script>'}, {body:{block:"admin/new_highschool"}});
});

router.post('/highschools/new', authenticate, function(req, res, next) {
  if(req.body.name.length == 0 || req.body.location.length == 0) res.send("0");
  else {
    var highschool = { name: req.body.name, location: req.body.location };
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("highschools").insertOne(highschool, function(err, res) {
        if(err) throw err;
        db.close();
      })
    })
    res.send("1");
  }
});

module.exports = router;
