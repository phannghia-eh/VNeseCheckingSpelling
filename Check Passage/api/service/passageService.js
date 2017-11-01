'use strict'


var wordService = require('./wordService');

function getListWrongWordsFromPassage(passage) {
    var arrWords = passage.split(" ");
    var listWrongWords = [];
    var wrongWord = {};
    for (var i = 0; i < arrWords.length; i++) {
        wrongWord = wordService.getListSuggestions(arrWords[i]);

        if (wrongWord.wrongWord !== '') {
            wrongWord.pos = i;
            listWrongWords.push(wrongWord);
        }
    }

    return listWrongWords;

}

exports.getListWrongWordsFromPassage = getListWrongWordsFromPassage;