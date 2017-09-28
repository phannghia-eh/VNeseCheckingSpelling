

exports.load = function () {
    var fs = require('fs');
    var dicFile = 'data/dictionary.txt';
    var result;

    var data = fs.readFileSync(dicFile, 'utf8');
    data = data.split('\n');


    return result;
};