'use strict'

var fs = require('fs');
var Diacritics = require('diacritic');


// Hàm bỏ dấu câu
function removeAccent(str) {
    str = str.toLowerCase();//chuyển về chữ thường
    str = Diacritics.clean(str); //bỏ dấu
    return str;
}


//Kiểm tra sự gần giống giữa hai từ, nhận vô 2 tham số là từ sai và từ được chọn để gợi ý
function isSugessionWord(wrongWord, suggestiveWord) {
    wrongWord = removeAccent(wrongWord);
    suggestiveWord = removeAccent(suggestiveWord);

    if (
        (wrongWord.includes(suggestiveWord) && suggestiveWord.length > 2)//Nếu từ sai khi bỏ dấu bao gồm từ gợi ý thì trả về true
        ||
        (suggestiveWord === wrongWord)//Nếu từ sai khi bỏ dấu bằng với từ gợi ý khi bỏ dấu
    ) {

        return true;
    }
    return false;
}

function getListSuggestions(word) {
    //Từ sai gồm từ sai và danh sách từ gợi ý
    var wrongWord = {
        wrongWord: '',
        suggestions: []
    }

    //Biến temp    var temp = 0;

    //Nếu từ được truyền có trong csdl thì trả về không kiểm tra nữa khi temp = 1
    var temp = 0;
    var dictionary = fs.readFileSync('dictionary.txt', 'utf8').toString().split('\r\n');

    //Đề phòng từ có dấu ,.;:
    var tempWord = '';

    //Trường hợp có dấu sau từ
    tempWord = word.replace(/[,\.;:]/g, '');
    console.log(tempWord);

    //so sánh
    //use binary search
    temp = search(dictionary, tempWord.toLowerCase());
    console.log(temp);

    //temp = -1 tức là từ được truyền k có trong csdl
    if (temp === -1) {
        wrongWord.wrongWord = word;
        dictionary.forEach(function (line) {
            if (isSugessionWord(tempWord , line)) {//So sánh độ giống nhau
                wrongWord.suggestions.push(line);
            }
        });
    }

    wrongWord.suggestions.sort(function (a, b) {//Sắp xếp các từ gợi ý theo length giảm dần
        return b.length - a.length;
    });

    return wrongWord;
}

function search(dictionary, word) {
    let first = 0;
    let last = dictionary.length - 1;
    while(first < last) {
        let mid = parseInt((last + first) / 2);
        console.log(mid);
        if(dictionary[mid].localeCompare(word) > 0) {
            last = mid;
        } else if(dictionary[mid].localeCompare(word) < 0) {
            first = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
}

exports.removeAccent = removeAccent;
exports.isSugessionWord = isSugessionWord;
exports.getListSuggestions = getListSuggestions;