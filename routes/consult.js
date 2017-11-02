var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.layout('layout', {title:"IVY: Consult"}, {body:{block:"consult"}});
});

module.exports = router;
