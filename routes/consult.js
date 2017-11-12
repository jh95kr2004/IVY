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
    db.collection("students").find().toArray(function(err, result) {
    });
  });
  res.layout('layout', {title:"IVY: Consult", head:""}, {body:{block:"consult"}});
});

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
