var arr = [];
var resultFromAPI = null;
var beginIndexWrongWord = -1;
var prevObjArr = [];

$(document).on('click', function(event){
    console.log(event.target);
    if(event.target.nodeName === 'MARK'){
        var idName = event.target.id;
        beginIndexWrongWord = getBeginIndexOfWrongWord(idName);
        const sizeArr = prevObjArr.length;
        for(let k = 0; k < sizeArr; k++){
            if(prevObjArr[k].curIndexWordClick < beginIndexWrongWord){
                beginIndexWrongWord = beginIndexWrongWord + prevObjArr[k].delta;
            }
        }

        document.getElementById("fade").style.display = 'block';
        var FixError = document.getElementById("light");
        FixError.style.display = 'block';
        let size = resultFromAPI.length;
        for(let i = 0; i < size; i++){
            if(resultFromAPI[i].wrongWord === event.target.innerHTML){
                curIndexWordClick=i;
                FixError.innerHTML = "";
                for(let k = 0; k < resultFromAPI[i].suggestions.length; k++){
                    FixError.innerHTML += ("<li id=\"" + idName + "\">" + resultFromAPI[i].suggestions[k]+ "</li>");
                }
                break;
            }
        }
    } else if (event.target.nodeName === 'LI') {
        var ErrorElement = document.getElementById(event.target.id);
        console.log('ErrorElement', ErrorElement);
        ErrorElement.innerHTML = event.target.innerHTML;
        console.log('eiii', ErrorElement.innerHTML);
        
        document.getElementById("fade").style.display = 'none';
        var FixError = document.getElementById("light");
        FixError.style.display = 'none';
        FixError.innerHTML = '';
        let txt_area = $('#text-area-1').val();
        const wrongWord = resultFromAPI[curIndexWordClick].wrongWord;
        const alterWord = event.target.innerHTML;
        prevObjArr.push({
            prevWrongWord: wrongWord,
            prevAlterWord: alterWord,
            curIndexWordClick: beginIndexWrongWord,
            delta: (alterWord.length - wrongWord.length)
        });

        let leftStr = txt_area.substring(0, beginIndexWrongWord);
        let rightStr = txt_area.substring(beginIndexWrongWord+wrongWord.length);
        $('#text-area-1').val(leftStr + alterWord + rightStr);
    }
});

$('#edit-paragraph-btn').on('click', function(){
    $('#text-area-1').css('z-index', '2');
})

$('#checking-passage').on('click', function(){
    resetInitValue();
    let text = $('#text-area-1').val();
    $('#text-area-1').css('z-index', '1');
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/passage',
        data: {
            passage: text
        }
    }).done(function(result){
        resultFromAPI = result;
        highlightWrongWord(result);
    }).fail(function(error){
        console.log(error);
    });
})


function highlightWrongWord(result){
    let size = result.length;
    for(let i = 0; i < size; i++){
        arr.push(result[i].wrongWord);
    }
    $('#text-area-1').highlightWithinTextarea({
        highlight: arr
    });
}

function getBeginIndexOfWrongWord(str){
    const lastIndexOf_ = str.lastIndexOf('_');
    let number = str.substring(lastIndexOf_+1);
    return Number(number);
}

function resetInitValue(){
    beginIndexWrongWord = -1;
    prevObjArr = [];
}