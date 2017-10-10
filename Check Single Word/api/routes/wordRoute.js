
'use strict'

module.exports = function(app){

    var wordController = require('../controllers/wordController');
    var passageController = require('../controllers/passageController');

    app.route('/word').post(wordController.listSuggestions);

    app.route('/passage').post(passageController.getListWrongWords);
}