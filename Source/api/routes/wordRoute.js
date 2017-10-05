
'use strict'

module.exports = function(app){

    var wordController = require('../controllers/wordController');

    app.route('/word').post(wordController.listSuggestions);
}