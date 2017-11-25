var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/IVY";

// merge

var authenticate = function(req, res, next) {
  if(req.session.user) {
    if(req.session.user.permission != 'consultant')
      res.layout('layout', {title:"IVY: No permission", head:""}, {body:{block:"caution", data:{title: "No Permission", description:"You don't have a permission to access consulting service."}}});
    else
      next();
  }
  else
    res.redirect('/login');
}

/* GET home page. */
router.get('/', authenticate, function(req, res, next) {
  var studentListHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("students").find().toArray(function(err, result) {
    });
  });
  res.layout('layout', {title:"IVY: Consult", head:""}, {body:{block:"consult"}});
});

router.post('/new', authenticate, function(req, res, next) {
  if(req.body.name.length == 0 || req.body.grade < 10 || req.body.grade > 12) res.send("0");
  else {
    var student = { name: req.body.name, grade: req.body.grade, highschool: new ObjectID(req.body.highschool) }
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("students").insertOne(student, function(err, res) {
        if(err) throw err;
        db.collection("accounts").updateOne({ email: req.session.user.email }, { $push: { students: new ObjectID(res.ops._id) } }, function(err, res) {
          db.close();
        });
        db.close();
      })
    })
    res.send("1");
  }
})

router.get('/new', authenticate, function(req, res, next) {
  res.layout('layout', {title:"IVY: New Student", head:'<script src="/javascripts/new.js"></script>'}, {body:{block:"new"}});
});

router.get('/edit/:id', authenticate, function(req, res, next) {
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
