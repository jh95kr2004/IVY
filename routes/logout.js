var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/IVY";

router.get('/', function(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
});

module.exports = router;
