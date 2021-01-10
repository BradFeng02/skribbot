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
        if (args === '42["lobbyChooseWord",0]') {
            google.search.cse.element.getElement('standard0').execute(document.getElementsByClassName('word')[0].innerText);
            document.getElementById('droprgn').style.display = 'block';
            document.getElementById('dragrgn').style.display = 'block';
        } else if (args === '42["lobbyChooseWord",1]') {
            google.search.cse.element.getElement('standard0').execute(document.getElementsByClassName('word')[1].innerText);
            document.getElementById('droprgn').style.display = 'block';
            document.getElementById('dragrgn').style.display = 'block';
        } else if (args === '42["lobbyChooseWord",2]') {
            google.search.cse.element.getElement('standard0').execute(document.getElementsByClassName('word')[2].innerText);
            document.getElementById('droprgn').style.display = 'block';
            document.getElementById('dragrgn').style.display = 'block';
        }
    }
    return socket;
};

//UI code (run after page load)
document.addEventListener('DOMContentLoaded', (event) => {
    //test button
    var testbutton = document.createElement("Button");
    testbutton.innerHTML = "test";
    testbutton.style = "top:0;right:0;position:absolute;z-index:42000"
    document.body.appendChild(testbutton);
    testbutton.addEventListener("click", function() {
        console.log('boop');
        dropRegion.style.display = dropRegion.style.display === 'block' ? 'none' : 'block';
        dragRegion.style.display = dragRegion.style.display === 'block' ? 'none' : 'block';
    });

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

    //store images
    var droppedimg = document.createElement('img');
    document.body.appendChild(droppedimg);
    droppedimg.style.display = 'none';
    droppedimg.crossOrigin = '';
    // droppedimg.style.position='fixed';
    // droppedimg.style.zIndex='69';
    // droppedimg.style.top='0';
    // droppedimg.style.left='0';
    droppedimg.onload = function() {
        console.log('new image');
        dropRegion.style.display = 'none';
        dragRegion.style.display = 'none';

        //processes image
        const wid = 80 * 2;
        const hgt = 60 * 2;
        var mat = cv.imread(droppedimg);
        cv.cvtColor(mat, mat, cv.COLOR_BGRA2BGR);
        var r = mat.rows / mat.cols;
        if (r > 0.75) { // hgt/wid=0.75
            cv.resize(mat, mat, new cv.Size(Math.round(hgt / r), hgt), 0, 0, cv.INTER_LANCZOS4)
        } else {
            cv.resize(mat, mat, new cv.Size(wid, Math.round(wid * r)), 0, 0, cv.INTER_LANCZOS4)
        }
        const imw = mat.cols;
        const imh = mat.rows;

        // console.log(mat.type());
        // console.log(mat.data);

        //draw image
        // const maxlen = 7;



        // for (var y = 0; y < imh; y++) {
        //     var drawpayload = '42["drawCommands",[';
        //     for (var x = 0; x < imw; x++) {
        //         let r = mat.data[4 * (x + y * imw) + 0]
        //         let g = mat.data[4 * (x + y * imw) + 1]
        //         let b = mat.data[4 * (x + y * imw) + 2]
        //         drawpayload = drawpayload.concat('[0,' + ((0.21 * r + 0.72 * g + 0.07 * b) > 128 ? 0 : 1) + ',0,' + x * 3 + ',' + y * 3 + ',' + (x + 1) * 3 + ',' + (y + 1) * 3 + '],');
        //     }
        //     drawpayload = drawpayload.slice(0, -1);
        //     drawpayload = drawpayload.concat(']]');
        //     sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: drawpayload, origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }));
        // }

        // const wid = 800;
        // const hgt = 600;
        // var drawpayload = '42["drawCommands",[';
        // for (x = 0; x < 1000; x++) {
        //     drawpayload = drawpayload.concat('[0,' + (x) % 21 + ',0,' + 0 + ',' + (300 + 300 * Math.sin(x)) + ',' + 800 + ',' + (300 + 300 * Math.cos(x)) + '],');
        // }
        // drawpayload = drawpayload.slice(0, -1);
        // drawpayload = drawpayload.concat(']]');
        // console.log("DELIVERING");
        // sockets[sockets.length - 1].onmessage(new MessageEvent('message', { isTrusted: true, data: drawpayload, origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null }));

        //clean up
        mat.delete();
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

})

//BTW: onmessage painting message while painting draws for both you AND the audience. PERFECT!.
//sockets[sockets.length-1].send('42["chat","HAHAHAAH YES!!!!!"]');
//sockets[sockets.length-1].onmessage(new MessageEvent('message', {isTrusted: true, data: '42["lobbyDrawTime",30]', origin: "wss://server2.skribbl.io:5008", lastEventId: "", source: null}));
//'42["drawCommands",[[0,color,size,x1,y1,x2,y2],[0,1,12,486,292,491,318],[0,1,12,491,318,491,329]]]'