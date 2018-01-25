var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.session.user) {
    if(req.session.user.permission == 'administrator') res.layout('index', {nav: "<a class='nav-link' href='admin'>ADMIN</a>"});
    else if(req.session.user.permission == 'consultant') res.layout('index', {nav: "<a class='nav-link' href='consult'>CONSULT</a>"});
  }
  else {
    res.layout('index', {nav: "<a class='nav-link' href='login'>SIGN IN</a>"});
  }
});

module.exports = router;
