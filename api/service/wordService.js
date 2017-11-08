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

    //csdl
    var dictionary = fs.readFileSync('dictionary.txt', 'utf8').toString().split('\r\n');
    dictionary.sort(function(a, b) {
        return a.localeCompare(b);
    });

    //Đề phòng từ có dấu ,.;:
    var tempWord = '';

    //Trường hợp có dấu sau từ
    tempWord = word.replace(/[,\.;:]/g, '');
    console.log(tempWord);

    if (!isWord(dictionary, tempWord.toLowerCase())) {
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

function isWord(dictionary, word) {
    if ((search(dictionary, word) > -1) || (checkWord(word) > -1)) {
        return true;
    }
    return false;
}

function search(dictionary, word) {
    let first = 0;
    let last = dictionary.length - 1;
    while (first < last) {
        let mid = parseInt((last + first) / 2);
        console.log(mid);
        if (dictionary[mid].localeCompare(word) > 0) {
            last = mid;
        } else if (dictionary[mid].localeCompare(word) < 0) {
            first = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
}

function checkWord(word) {
    let first_arr = [ "b", "c", "ch", "d", "đ", "g", "gh", "h", "k", "kh", "l", "m", "n", "ng", "ngh", "nh", "p", "ph", "q", "r", "s", "t", "th", "tr", "v", "x", "none" ];
    let last_arr = [ "c", "ch", "m", "n", "ng", "nh", "p", "t", "none" ];
    let mid_arr = [ "a", "á", "ai", "au", "ay", "e", "eo", "i", "ia", "iai", "iày", "iá", "iáo", "uyễ" ];

    let isWord = -1;

    //Trường hợp [none] - [Âm giữa] - [none]
    if (word.length <= 3) {
        for(let ag in mid_arr) {
            if (ag == word) {
                isWord = 1;
                break;
            }
        }
    } 
    if (isWord < 0) {
        let word_arr = word.split("");

        //Mảng âm đầu
        let tmp_first_arr = new Array();
        first_arr.forEach(function(ad) {
            if (word_arr[0] == ad) {
                tmp_first_arr.push(ad);
            }

            if (word_arr.length > 2) {
                if (word_arr[0] + word_arr[1] == ad) {
                    tmp_first_arr.push(ad);
                }
            }
            if (word_arr.length > 3) {
                if (word_arr[0] + word_arr[1] + word_arr[2] == ad) {
                    tmp_first_arr.push(ad);
                }
            }
        });

        //Mảng âm cuối
        let tmp_last_arr = new Array();
        last_arr.forEach(function(ac) {
            if (word_arr[word_arr.length - 1] == ac) {
                tmp_last_arr.push(ac);
            }

            if (word_arr.length > 2) {
                if (word_arr[word_arr.length - 2] + word_arr[word_arr.length - 1] == ac) {
                    tmp_last_arr.push(ac);
                }
            }
        });

        //Trường hợp [has] - [Âm giữa] - [none]
        tmp_first_arr.forEach(function(ad) {
            var tmp_mid_arr = word.replace(ad, "");
            isWord = search(mid_arr, tmp_mid_arr);
        });

        //Trường hợp [none] - [Âm giữa] - [has]
        if (isWord < 0) {
            tmp_last_arr.forEach(function(ac) {
                var tmp_mid_arr = word.replace(ac, "");
                isWord = search(mid_arr, tmp_mid_arr);
            });
        }

        //Trường hợp [has] - [Âm giữa] - [has]
        if (isWord < 0) {
            tmp_first_arr.forEach(function(ad) {
                tmp_last_arr.forEach(function(ac) {
                    var tmp_mid_arr = word.replace(ad, "").replace(ac, "");
                    isWord = search(mid_arr, tmp_mid_arr);
                });
            });
        }
    }
    return isWord;
}

exports.removeAccent = removeAccent;
exports.isSugessionWord = isSugessionWord;
exports.getListSuggestions = getListSuggestions;