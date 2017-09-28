var express = require('express');
var router = express.Router();
var controller = require('../controller/dictionary');

router.get('/', function(req, res, next) {
    controller.load();
    res.json("");
});

module.exports = router;
