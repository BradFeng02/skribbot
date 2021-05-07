window.curword = "hi";
window.searchwin;

//fake websockets
window.sockets = [];
const realWebSocket = window.WebSocket;
window.WebSocket = function(...args) {
    console.log("websocket was created");
    const socket = new realWebSocket(...args);
    window.sockets.push(socket);
    const realsend = socket.send;
    socket.directsend = realsend;
    socket.send = function(args) {
        socket.directsend(args);
        //detect your word
        if (args.substring(0, 19) === '42["lobbyChooseWord') {
            curword = document.getElementsByClassName('word')[parseInt(args[21])].innerText; //get word
            focussearch(true);
        }
    }
    return socket;
};

//if update, search curword
function focussearch(update) {
    if (searchwin.closed) {
        searchwin = window.open("https://www.google.com/search?q=" + curword + "&tbm=isch&tbs=itp:clipart&hl=en-US");
    } else if (update) {
        searchwin.location.href = "https://www.google.com/search?q=" + curword + "&tbm=isch&tbs=itp:clipart&hl=en-US";
    }
    // searchwin.moveTo(window.screenLeft, window.screenTop);
    // searchwin.resizeTo(window.outerWidth / 2, window.outerHeight);
    searchwin.focus();
    //document.getElementById('droprgn').style.display = 'block';
}

//UI code (run after page load)
document.addEventListener('DOMContentLoaded', (event) => {
    //test button (toggles search and droprgn)
    var testbutton = document.createElement("Button");
    testbutton.innerHTML = "fix";
    testbutton.style = "top:0;right:0;position:absolute;z-index:42000;height:50px";
    document.body.appendChild(testbutton);
    testbutton.addEventListener("click", function() {
        console.log('boop');
        focussearch(false);
    });

    //setting this lets us be able to search for active drawer with just display: block;
    document.querySelector("#gamePlayerDummy>.avatar>.drawing").setAttribute("style", "display:block");

    window.searchwin = window.open("https://www.google.com/search?q=" + curword + "&tbm=isch&tbs=itp:clipart&hl=en-US");

    //takes images
    var dropRegion = document.createElement('div');
    document.body.appendChild(dropRegion);
    dropRegion.id = 'droprgn';
    dropRegion.style.display = 'block';
    dropRegion.style.backgroundColor = "yellow";
    dropRegion.style.opacity = '50%';
    dropRegion.style.position = 'absolute';
    dropRegion.style.zIndex = '6969';
    dropRegion.style.top = '0';
    dropRegion.style.right = '0';
    dropRegion.style.height = '69px';
    dropRegion.style.width = '50%';

    //best colors
    window.colorcode = [20, -1, 21, 3, 4, 5, 7, 9, 14, 11, 13, 15, -1, -1, 16, 18, 0, 6, 1, 8, 12, -1, 2, 19, 10, 17];

    function bestColor(r, g, b) {
        return colorcode[best_colors[((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff)].charCodeAt() - 97];
    }

    window.fr = fakereceive;
    //calls onmessage of active socket with msg
    function fakereceive(msg) {
        sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: msg, origin: "", lastEventId: "", source: null }));
    }

    //direct sends msg to active socket
    function fakesend(msg) {
        sockets[sockets.length - 1].directsend(msg);
    }

    //sends then receives message
    function fakedraw(drawpayload) {
        //both draws AND sends but SLOWER
        //sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: drawpayload, origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }));

        //max draw message length: 8
        //sends
        fakesend(drawpayload);
        //draws for us (wont resend because of the suppress function)
        fakereceive(drawpayload);
    }

    //clear canvas with direct send
    function clear() {
        fakedraw('42["canvasClear"]');
    }

    //current drawer id
    window.curDrawID = -1;
    window.ogtimer = 0;
    window.timestart = Date.now();

    //nice way to know if processing started without pausing the timer
    function prepare() {
        //used to sync timer later
        ogtimer = document.getElementById("timer").innerHTML;
        timestart = Date.now();

        //get cur drawer id (doing before because after suppress, drawing element disappears)
        curDrawID = parseInt(document.querySelector('.drawing[style*="display: block;"]').parentElement.parentElement.id.substring(6));

        fakereceive('42["lobbyPlayerConnected",{"id":-1,"name":"SKRIBBOT","avatar":[17,1,4,2],"score":-696969,"guessedWord":false}]'); //skribbot joins lol
        // fakereceive('42["chat",{"id":-1,"message":"PROCESSING IMAGE"}]');
    }

    //stops onmessage while drawing from auto sending commands //call when drawing starts
    function suppress() {
        //fakereceive('42["lobbyReveal",{"reason":"DL","word":"SKRIBBOT IS DRAWING","scores":[]}]');
        fakereceive('42["lobbyPlayerRateDrawing",[-1,-1,1]]');
        fakereceive('42["lobbyPlayerGuessedWord",-1]')
        fakereceive('42["lobbyPlayerDrawing",-1]');
    }

    //brings back drawing controls (when called after suppress during your turn)
    function unsuppress() {
        fakereceive('42["chat",{"id":-1,"message":"DONE DRAWING"}]');
        fakereceive('42["lobbyPlayerDisconnected",-1]')
        fakereceive('42["lobbyPlayerDrawing",' + curDrawID + ']');

        //sync timer
        let t = ogtimer - Math.ceil((Date.now() - timestart) / 1000);
        if (t > 0) fakereceive('42["lobbyTime",' + t + ']');
    }

    //store images
    var droppedimg = document.createElement('img');
    document.body.appendChild(droppedimg);
    droppedimg.style.display = 'none';
    droppedimg.crossOrigin = '';
    // droppedimg.style.position='fixed';
    // droppedimg.style.zIndex='69';
    // droppedimg.style.top='0';
    // droppedimg.style.left='0';

    function fillcolor(cc, maxx, minx, maxy, miny, mats, k, imw, imh, psize, usedcolors) {
        let c = cc % 22;
        //erode region with contours
        // let e = mat.roi(new cv.Rect(minx, miny, maxx - minx, maxy - miny));
        cv.erode(mats[c], mats[c], k, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, [0, 0, 0, 0]); //erode with borders black

        let drawpayload = '42["drawCommands",[';
        let temp = 0;

        //if corner, fill
        for (let fx = minx; fx <= maxx; fx += 2) { //inc by 2 to hopefully speed it up, most situations unaffected
            for (let fy = miny; fy <= maxy; fy += 2) {
                if (mats[c].data[fy * imw + fx] == 255 && //is on AND
                    ((fy == 0 || mats[c].data[(fy - 1) * imw + fx] == 0) || //up is off
                        (fy == imh - 1 || mats[c].data[(fy + 1) * imw + fx] == 0)) && //or down is off AND
                    ((fx == 0 || mats[c].data[fy * imw + fx - 1] == 0) || //left is off
                        (fx == imw - 1 || mats[c].data[fy * imw + fx + 1] == 0))) { //or right is off

                    if (++temp >= 8) {
                        drawpayload = drawpayload.slice(0, -1);
                        drawpayload += ']]';
                        fakedraw(drawpayload);
                        drawpayload = '42["drawCommands",[';
                        temp = 0;
                    }
                    drawpayload += '[2,' + c + ',' + (fx * psize) + ',' + (fy * psize) + '],';
                    //drawpayload += '[0,' + c + ',6,' + (fx * psize) + ',' + (fy * psize) + ',' + (fx * psize) + ',' + (fy * psize) + '],';
                }
            }
        }

        drawpayload = drawpayload.slice(0, -1);
        drawpayload += ']]';
        fakedraw(drawpayload);

        if (cc < 21) {
            setTimeout(function() { drawcolor(cc + 1, mats, imw, imh, psize, k, usedcolors) }, 0);
        } else {
            unsuppress();
            console.log("done");
        }
    }

    function drawcolor(cc, mats, imw, imh, psize, k, usedcolors) {
        let c = cc % 22;
        console.log("drawing", c);
        let skipfill = false;

        if (usedcolors.has(c)) {
            let contours = new cv.MatVector();
            let h = new cv.Mat();
            cv.findContours(mats[c], contours, h, cv.RETR_TREE, cv.CHAIN_APPROX_TC89_KCOS);

            //bounding box for all contours
            let minx = imw - 1;
            let maxx = 0;
            let miny = imh - 1;
            let maxy = 0;

            let temp = 0;

            for (let i = 0; i < contours.size(); ++i) {
                const cont = contours.get(i);
                if (cv.contourArea(cont) < 4) continue; //(used to be 7)  //MIN SIZE OF CONTOUR TO DRAW

                let drawpayload = '42["drawCommands",[';

                let x = cont.data32S[0];
                let y = cont.data32S[1];

                for (let j = 0; j < cont.data32S.length - 2; j += 2) {
                    if (x < minx) minx = x;
                    if (x > maxx) maxx = x;
                    if (y < miny) miny = y;
                    if (y > maxy) maxy = y;

                    nextx = cont.data32S[j + 2];
                    nexty = cont.data32S[j + 3];

                    if (++temp >= 8) {
                        drawpayload = drawpayload.slice(0, -1);
                        drawpayload += ']]';
                        fakedraw(drawpayload);
                        drawpayload = '42["drawCommands",[';
                        temp = 0;
                    }
                    drawpayload += '[0,' + c + ',0,' + x * psize + ',' + y * psize + ',' + nextx * psize + ',' + nexty * psize + '],';

                    x = nextx;
                    y = nexty;
                }
                if (x < minx) minx = x;
                if (x > maxx) maxx = x;
                if (y < miny) miny = y;
                if (y > maxy) maxy = y;

                if (++temp >= 8) {
                    drawpayload = drawpayload.slice(0, -1);
                    drawpayload += ']]';
                    fakedraw(drawpayload);
                    drawpayload = '42["drawCommands",[';
                    temp = 0;
                }
                drawpayload += '[0,' + c + ',0,' + x * psize + ',' + y * psize + ',' + cont.data32S[0] * psize + ',' + cont.data32S[1] * psize + '],';

                drawpayload = drawpayload.slice(0, -1);
                drawpayload += ']]';
                fakedraw(drawpayload);
            }

            //fill contours
            if (maxx > minx && maxy > miny) {
                setTimeout(function() { fillcolor(cc, maxx, minx, maxy, miny, mats, k, imw, imh, psize, usedcolors) }, 0);
            } else {
                skipfill = true;
            }
        } else {
            skipfill = true;
        }

        if (skipfill) {
            if (cc < 21) { //loop back to white once
                setTimeout(function() { drawcolor(cc + 1, mats, imw, imh, psize, k, usedcolors) }, 0);
            } else {
                unsuppress();
                console.log("done");
            }
        }
    }

    function processimg() {
        //process image
        //scale * psize <= 10 !!!!!
        const scale = 5;
        const psize = 2; //for drawing
        const kernelsize = 5; //keep it odd
        const MAX_WID = 80 * scale;
        const MAX_HGT = 60 * scale;

        var src = cv.imread(droppedimg);

        //resize
        var r = src.rows / src.cols;
        if (r > MAX_HGT / MAX_WID) { // hgt/wid=0.75
            cv.resize(src, src, new cv.Size(Math.round(MAX_HGT / r), MAX_HGT), 0, 0, cv.INTER_LANCZOS4); //INTER_AREA
        } else {
            cv.resize(src, src, new cv.Size(MAX_WID, Math.round(MAX_WID * r)), 0, 0, cv.INTER_LANCZOS4);
        }
        const imw = src.cols;
        const imh = src.rows;

        //change transparent to white
        if (src.type = cv.CV_8UC4) {
            for (let x = 0; x < src.cols; ++x) {
                for (let y = 0; y < src.rows; ++y) {
                    let i = y * src.cols * 4 + x * 4;
                    if (src.data[i + 3] == 0) {
                        src.data[i] = 255;
                        src.data[i + 1] = 255;
                        src.data[i + 2] = 255;
                    }
                }
            }
        }
        cv.cvtColor(src, src, cv.COLOR_BGRA2BGR);

        //create threshed mats
        let mats = new Array(22);
        for (let i = 0; i < 22; ++i) {
            mats[i] = cv.Mat.zeros(imh, imw, cv.CV_8UC1);
        }
        let usedcolors = new Set();
        for (let x = 0; x < imw; ++x) {
            for (let y = 0; y < imh; ++y) {
                let r = src.data[y * imw * 3 + x * 3];
                let g = src.data[y * imw * 3 + x * 3 + 1];
                let b = src.data[y * imw * 3 + x * 3 + 2];
                bc = bestColor(r, g, b);
                usedcolors.add(bc);
                mats[bc].data[y * imw + x] = 255;
            }
        }

        console.log("processing done");

        //draw image
        // const maxlen = 7;

        let k = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(kernelsize, kernelsize));

        suppress();
        clear();
        setTimeout(function() {
            clear(); //clear again because if something drawing, doesnt get cleared first time
            setTimeout(function() { drawcolor(1, mats, imw, imh, psize, k, usedcolors) }, 200);
        }, 100)

        src.delete();
    }

    droppedimg.onload = function() { //when image selected
        console.log('new image');
        // dropRegion.style.display = 'none';

        prepare();
        //delay because clear canvas leaves last message if it is still drawing
        setTimeout(function() { processimg() }, 100);

    }

    //dragndrop setup
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        //retrieves image and stores in droppedimg
        var html = e.dataTransfer.getData('text/html'),
            match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
            imageUrl = match && match[1];
        // imageUrl=imageUrl.replace(/(^\w+:|^)\/\//, '');
        if (imageUrl) {
            console.log("img dropped");
            droppedimg.src = ('http://localhost:8080/' + imageUrl);
        }
        // console.log(imageUrl); 
    }
    dropRegion.addEventListener('dragenter', preventDefault, false);
    dropRegion.addEventListener('dragleave', preventDefault, false);
    dropRegion.addEventListener('dragover', preventDefault, false);
    dropRegion.addEventListener('drop', handleDrop, false);

    dropRegion.onpaste = function(pasteEvent) {
        var item = pasteEvent.clipboardData.items[0];
        //console.log(item);
        if (item.type.indexOf("image") === 0) //any image (but snipping tool gives png)
        {
            console.log("img pasted (MIME type:", item.type + ")");
            var blob = item.getAsFile();

            var reader = new FileReader();
            reader.onload = function(event) {
                droppedimg.src = event.target.result;
            };

            reader.readAsDataURL(blob);
        }
    }
});