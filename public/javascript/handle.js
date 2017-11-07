var arr = [];
var resultFromAPI = null;

$(document).on('click', function(event){
    console.log(event.target);
    if(event.target.nodeName === 'MARK'){
        var idName = event.target.id;

        document.getElementById("fade").style.display = 'block';
        var FixError = document.getElementById("light");
        FixError.style.display = 'block';
        let size = resultFromAPI.length;
        for(let i = 0; i < size; i++){
            if(resultFromAPI[i].wrongWord === event.target.innerHTML){
                FixError.innerHTML = "";
                for(let k = 0; k < resultFromAPI[i].suggestions.length; k++){
                    FixError.innerHTML += ("<li id=\"" + idName + "\">" + resultFromAPI[i].suggestions[k]+ "</li>");
                }
                break;
            }
        }
    } else if (event.target.nodeName === 'LI') {
        var ErrorElement = document.getElementById(event.target.id);
        ErrorElement.innerHTML = event.target.innerHTML;
        console.log(ErrorElement.innerHTML);
        
        document.getElementById("fade").style.display = 'none';
        var FixError = document.getElementById("light");
        FixError.style.display = 'none';
        FixError.innerHTML = '';      
    }
});

$('#checking-passage').on('click', function(){
    let text = $('#text-area-1').val();
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
