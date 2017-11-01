

'use strict'

var passageService = require('../service/passageService');

exports.getListWrongWords = function(req, res){
    var passage = req.body.passage;
    var listWrongWords = passageService.getListWrongWordsFromPassage(passage);
    res.send(listWrongWords);

}