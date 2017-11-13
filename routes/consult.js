var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/IVY";

/* GET home page. */
router.get('/', function(req, res, next) {
  checkLoginConsult(req, res);
  var studentListHtml = "";
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection("accounts").findOne({ email: req.session.user.email }, function(err, res) {
      if(err) throw err;
      res.students.forEach(function(id) {
        db.collection("students").findOne({ _id: id }, function(err, res) {
          studentListHtml += "<tr><td>" + res.name + "</td><td>" + res.grade + "th grade</td><td>" + res.highschool + "</td><td>!</td></tr>"
        });
      });
    });
  });
  console.log(studentListHtml);
  res.layout('layout', {title:"IVY: Consult", head:""}, {body:{block:"consult"}});
});

router.post('/new', function(req, res, next) {
  checkLoginConsult(req, res);
  if(req.body.name.length == 0 || req.body.grade < 10 || req.body.grade > 12) res.send("0");
  else {
    var student = { name: req.body.name, grade: req.body.grade, highschool: req.body.highschool }
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      db.collection("students").insertOne(student, function(err, res) {
        if(err) throw err;
        db.collection("accounts").updateOne({ email: req.session.user.email }, { $push: { students: res._id } }, function(err, res) {
          if(err) throw err;
          db.close();
        });
        db.close();
      })
    })
    res.send("1");
  }
})

router.get('/new', function(req, res, next) {
  checkLoginConsult(req, res);
  res.layout('layout', {title:"IVY: New Student", head:'<script src="/javascripts/new.js"></script>'}, {body:{block:"new"}});
});

router.get('/edit/:id', function(req, res, next) {
  checkLoginConsult(req, res);
});

function checkLoginConsult(req, res) {
  if(req.session.user) {
    if(req.session.user.permission != 'consultant')
      res.layout('layout', {title:"IVY: No permission", head:""}, {body:{block:"caution", data:{title: "No Permission", description:"You don't have a permission to access consulting service."}}});
  }
  else
    res.redirect('../login');
}

module.exports = router;
