
'use strict'


var wordService = require('../service/wordService');

exports.listSuggestions = function (req, res) {
    var word = req.body.word;
    var wrongWord = wordService.getListSuggestions(word);
    res.send(wrongWord);
}
