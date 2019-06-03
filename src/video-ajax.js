function createRequestObject() {
    var ro;
    var browser = navigator.appName;
    if (browser == "Microsoft Internet Explorer") {
        ro = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        ro = new XMLHttpRequest();
    }
    return ro;
}

var http = createRequestObject();

function convertResponseBodyToText(IEByteArray) {
    var ByteMapping = {};
    for (var i = 0; i < 256; i++) {
        for (var j = 0; j < 256; j++) {
            ByteMapping[String.fromCharCode(i + j * 256)] =
                String.fromCharCode(i) + String.fromCharCode(j);
        }
    }
    var rawBytes = IEBinaryToArray_ByteStr(IEByteArray);
    var lastChr = IEBinaryToArray_ByteStr_Last(IEByteArray);
    return rawBytes.replace(/[\s\S]/g,
            function (match) {
                return ByteMapping[match];
            }) + lastChr;
}

var IEBinaryToArray_ByteStr_Script =
    "<!-- IEBinaryToArray_ByteStr -->\r\n" +
    "<script type='text/vbscript'>\r\n" +
    "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
    "	IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
    "End Function\r\n" +
    "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
    "	Dim lastIndex\r\n" +
    "	lastIndex = LenB(Binary)\r\n" +
    "	if lastIndex mod 2 Then\r\n" +
    "		IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
    "	Else\r\n" +
    "		IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
    "	End If\r\n" +
    "End Function\r\n" +
    "</script>\r\n";
document.write(IEBinaryToArray_ByteStr_Script);

function loadfile2(filename, type) {
    if (typeof type === 'undefined') type = 'dec';
    //document.getElementById('testbild').innerHTML='server query....';
    if (type === 'dec') {
        http.open('get', 'http://localhost/google-webp/1.webp');

        if (http.overrideMimeType)
            http.overrideMimeType('text/plain; charset=x-user-defined');
        else
            http.setRequestHeader('Accept-Charset', 'x-user-defined');

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (typeof http.responseBody == 'undefined') {
                    var response = http.responseText.split('').map(function (e) {
                        return String.fromCharCode(e.charCodeAt(0) & 0xff)
                    }).join('');
                } else {
                    var response = convertResponseBodyToText(http.responseBody);
                }
                if (type === 'dec')
                    WebPDecodeAndDraw(response);
            } //else alert('Cannot load file. Please, try again');
        };
        http.send(null);

    } else if (type === 'enc')
        ImageToCanvas('/images-enc/' + filename)
}


function loadfile(imgData, canvas, context) {
    if (typeof type === 'undefined') type = 'dec';
    //document.getElementById('testbild').innerHTML='server query....';
    if (type === 'dec') {
        var imgTag = new Image();
        imgTag.src = imgData;
        http.open('get', imgTag.src);

        if (http.overrideMimeType)
            http.overrideMimeType('text/plain; charset=x-user-defined');
        else
            http.setRequestHeader('Accept-Charset', 'x-user-defined');

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (typeof http.responseBody == 'undefined') {
                    var response = http.responseText.split('').map(function (e) {
                        return String.fromCharCode(e.charCodeAt(0) & 0xff)
                    }).join('');
                } else {
                    var response = convertResponseBodyToText(http.responseBody);
                }
                if (type === 'dec')
                    if (virtualclass.gObj.meetingMode) {
                        WebPDecDemo(canvas.id);
                    }
                // WebPDecDemo(canvas.id);
                WebPDecodeAndDraw(response, canvas, context);
            } //else alert('Cannot load file. Please, try again');
        };
        http.send(null);

    } else if (type === 'enc')
        ImageToCanvas('/images-enc/' + filename)
}

