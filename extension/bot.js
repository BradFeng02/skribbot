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
        // if (args !== '42["canvasClear"]') socket.directsend(args); //block non skribbot origin clears (used to stop autosending)
        // else console.log("real clear blocked");
        socket.directsend(args);
        //detect your word
        const str1 = "https://www.google.com/search?q="; //for copy paste backup (in case search break)
        const str2 = "&tbm=isch&tbs=itp:clipart&hl=en-US";
        if (args === '42["lobbyChooseWord",0]') {
            let word = document.getElementsByClassName('word')[0].innerText; //get word
            //copy search string in case built in breaks
            navigator.clipboard.writeText(str1 + word + str2);
            google.search.cse.element.getElement('standard0').execute(word); //search word with built in
            document.getElementById('droprgn').style.display = 'block'; //show search and drop rgn
            document.getElementById('dragrgn').style.display = 'block';
        } else if (args === '42["lobbyChooseWord",1]') {
            let word = document.getElementsByClassName('word')[1].innerText;
            navigator.clipboard.writeText(str1 + word + str2);
            google.search.cse.element.getElement('standard0').execute(word);
            document.getElementById('droprgn').style.display = 'block';
            document.getElementById('dragrgn').style.display = 'block';
        } else if (args === '42["lobbyChooseWord",2]') {
            let word = document.getElementsByClassName('word')[2].innerText;
            navigator.clipboard.writeText(str1 + word + str2);
            google.search.cse.element.getElement('standard0').execute(word);
            document.getElementById('droprgn').style.display = 'block';
            document.getElementById('dragrgn').style.display = 'block';
        }
    }
    return socket;
};

//UI code (run after page load)
document.addEventListener('DOMContentLoaded', (event) => {
    //test button (toggles search and droprgn)
    var testbutton = document.createElement("Button");
    testbutton.innerHTML = "show/hide";
    testbutton.style = "top:0;right:0;position:absolute;z-index:42000;height:50px";
    document.body.appendChild(testbutton);
    testbutton.addEventListener("click", function() {
        console.log('boop');
        dropRegion.style.display = dropRegion.style.display === 'block' ? 'none' : 'block';
        dragRegion.style.display = dragRegion.style.display === 'block' ? 'none' : 'block';
    });

    //replaces clear canvas button with direct send clear
    // var clearcanvasbtn = document.getElementById("buttonClearCanvas");
    // clearcanvasbtn.addEventListener("click", function() {
    //     console.log('canvas cleared with button');
    //     clear();
    // });

    //takes images
    var dropRegion = document.createElement('div');
    document.body.appendChild(dropRegion);
    dropRegion.id = 'droprgn';
    dropRegion.style.display = 'none';
    dropRegion.style.backgroundColor = "yellow";
    dropRegion.style.opacity = '50%';
    dropRegion.style.position = 'fixed';
    dropRegion.style.zIndex = '6969';
    dropRegion.style.top = '0';
    dropRegion.style.right = '0';
    dropRegion.style.height = '100%';
    dropRegion.style.width = '50%';

    //searches images
    var dragRegion = document.createElement('div');
    document.body.appendChild(dragRegion);
    dragRegion.id = 'dragrgn';
    dragRegion.style.display = 'none';
    dragRegion.style.opacity = '95%';
    dragRegion.style.position = 'fixed';
    dragRegion.style.zIndex = '6969';
    dragRegion.style.top = '0';
    dragRegion.style.left = '0';
    dragRegion.style.height = '100%';
    dragRegion.style.width = '50%';
    dragRegion.style.overflow = 'scroll';
    var imgsearch = document.createElement('div');
    dragRegion.appendChild(imgsearch);
    imgsearch.setAttribute('data-image_type', 'clipart');
    imgsearch.setAttribute('data-disableWebSearch', 'true');
    imgsearch.setAttribute('data-mobileLayout', 'forced');
    // imgsearch.setAttribute('data-image_as_filetype','png');
    imgsearch.className = 'gcse-search';

    //best colors
    window.colorcode = [20, -1, 21, 3, 4, 5, 7, 9, 14, 11, 13, 15, -1, -1, 16, 18, 0, 6, 1, 8, 12, -1, 2, 19, 10, 17];

    function bestColor(r, g, b) {
        return colorcode[best_colors[((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff)].charCodeAt() - 97];
    }

    //sends and receives message
    function fakedraw(drawpayload) {
        //both draws AND sends but SLOWER
        //sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: drawpayload, origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }));

        //max draw message length: 8
        //sends
        sockets[sockets.length - 1].directsend(drawpayload);
        //draws for us (wont resend because of the suppress function)
        sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: drawpayload, origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }));
    }

    //clear canvas with direct send
    function clear() {
        sockets[sockets.length - 1].directsend('42["canvasClear"]');
    }

    //current drawer id
    window.curDrawID = -1;

    //stops onmessage while drawing from auto sending commands
    function suppress() {
        //get cur drawer id (doing before because after suppress, drawing element disappears)
        let e = document.getElementsByClassName("drawing");
        for (let i = 0; i < e.length; ++i) {
            if (e[i].style.display !== "none") {
                let s = e[i].parentElement.parentElement.id;
                if (s !== "gamePlayerDummy") {
                    curDrawID = parseInt(s.substring(6));
                    break;
                }
            }
        }

        sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: '42["lobbyReveal",{"reason":"DL","word":"skribbot is drawing","scores":[]}]', origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }))
    }

    //brings back drawing controls (when called after suppress during your turn)
    function unsuppress() {
        sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: '42["lobbyPlayerDrawing",' + curDrawID + ']', origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }))
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
        clear();
        suppress();

        //process image
        //scale * psize <= 10 !!!!!
        const scale = 5;
        const psize = 2; //for drawing
        const kernelsize = 5; //keep it odd
        const MAX_WID = 80 * scale;
        const MAX_HGT = 60 * scale;

        var src = cv.imread(droppedimg);

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

        //resize
        var r = src.rows / src.cols;
        if (r > MAX_HGT / MAX_WID) { // hgt/wid=0.75
            cv.resize(src, src, new cv.Size(Math.round(MAX_HGT / r), MAX_HGT), 0, 0, cv.INTER_LANCZOS4); //INTER_AREA
        } else {
            cv.resize(src, src, new cv.Size(MAX_WID, Math.round(MAX_WID * r)), 0, 0, cv.INTER_LANCZOS4);
        }
        const imw = src.cols;
        const imh = src.rows;

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

        setTimeout(function() { drawcolor(1, mats, imw, imh, psize, k, usedcolors) }, 0);

        src.delete();
    }

    droppedimg.onload = function() { //when image selected
        console.log('new image');
        dropRegion.style.display = 'none';
        dragRegion.style.display = 'none';

        clear();
        //delay because clear canvas leaves last message if it is still drawing
        setTimeout(function() { processimg() }, 300);

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
        if (imageUrl) droppedimg.setAttribute('src', 'http://localhost:8080/' + imageUrl);
        // console.log(imageUrl); 
    }
    dropRegion.addEventListener('dragenter', preventDefault, false);
    dropRegion.addEventListener('dragleave', preventDefault, false);
    dropRegion.addEventListener('dragover', preventDefault, false);
    dropRegion.addEventListener('drop', handleDrop, false);

});

//BTW: onmessage painting message while painting draws for both you AND the audience. PERFECT!.
//sockets[sockets.length-1].send('42["chat","HAHAHAAH YES!!!!!"]');
//sockets[sockets.length-1].onmessage(new MessageEvent('message', {isTrusted: true, data: '42["lobbyDrawTime",30]', origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null}));
//'42["drawCommands",[[0,color,size,x1,y1,x2,y2],[0,1,12,486,292,491,318],[0,1,12,491,318,491,329]]]'