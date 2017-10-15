//Đọc file bằng open File Dialog
document.getElementById('choose-file-button').addEventListener('change', onFileSelected, false);

//Hỗ trợ Drag Drop
var textArea = document.getElementById('content-editor');
textArea.addEventListener('dragover', onDragOver, false);
textArea.addEventListener('drop', onDrop, false);

var reader;

function onFileSelected(evt) {
    readText(evt.target, displayContents);
}

function checkFileAPI() {
    return (window.File && window.FileReader && window.FileList && window.Blob);
}

//Hàm thực sự đọc file, onFileRead là callback hàm sẽ gọi khi đọc được file xong.
function readText(filePath, onFileRead) {
    if (checkFileAPI()) {
        reader = new FileReader();
    }
    else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }

    var output = ""; //placeholder for text output

    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            onFileRead(output);
        };
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            onFileRead(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                    'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                    'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

function displayContents(txt) {
    var el = document.getElementById('text-area');
    el.value = txt;
}

function onDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function onDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var filePath = evt.dataTransfer;
    readText(filePath, displayContents);
}