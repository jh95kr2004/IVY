var express = require('express');
var ejs_layout = require('ejs-layouts');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.layout('layout', {title:"IVY: Sign in"}, {body:{block:"login"}});
});

module.exports = router;
