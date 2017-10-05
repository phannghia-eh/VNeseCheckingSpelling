
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
function isSugessionWord(wrongWord, suggestiveWord){
    wrongWord = removeAccent(wrongWord);
    suggestiveWord = removeAccent(suggestiveWord);

    if(
        (wrongWord.includes(suggestiveWord) && suggestiveWord.length > 2 )//Nếu từ sai khi bỏ dấu bao gồm từ gợi ý thì trả về true
        || 
        (suggestiveWord === wrongWord)//Nếu từ sai khi bỏ dấu bằng với từ gợi ý khi bỏ dấu
    ){
        return true;
    }
    return false;
}



exports.listSuggestions = async function (req, res) {
    var word = req.body.word;

    //Từ sai gồm từ sai và danh sách từ gợi ý
    var wrongWord = {
        wrongWord : '', 
        suggestions : []
    }

    //Biến temp
    var temp = 0;

    //Nếu từ được truyền có trong csdl thì trả về không kiểm tra nữa khi temp = 1
    await fs.readFileSync('dictionary.txt', 'utf8').toString().split('\r\n').forEach(function (line) {
        if (line === word) {
            temp = 1;
            console.log(line);
            return;
        }
    });

    //temp = 0 tức là từ được truyền k có trong csdl
    if (temp === 0) {
        wrongWord.wrongWord = word;
        await fs.readFileSync('dictionary.txt', 'utf8').toString().split('\r\n').forEach(function (line) {
            if (isSugessionWord(word, line)) {//So sánh độ giống nhau
                wrongWord.suggestions.push(line);
                console.log(line);
            }
        });
    }

    wrongWord.suggestions.sort(function(a,b){//Sắp xếp các từ gợi ý theo length giảm dần
        return b.length - a.length ;
    });

    res.send({wrongWord});
}

