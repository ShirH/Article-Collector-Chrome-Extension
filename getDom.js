
function getSelectionRect() {
    var selection = window.getSelection();      // get the selection then
    if (selection && selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        var scrollTop = $(window).scrollTop();
        var scrollLeft = $(window).scrollLeft();
        var div = document.createElement('div');   // make box
        div.style.border = '2px solid black';      // with outline
        div.style.left = rect.left+scrollLeft + 'px';
        div.style.backgroundColor = '#59baff';
        div.style.borderRadius = '15px';
        div.style.border = '2px solid';
        div.style.marginTop = '-2rem';
        div.style.paddingRight = '0.03%';
        div.style.paddingTop = '0.03%';
        div.style.paddingTop = '-2%';
        div.style.paddingLeft = '0.03%';
        div.style.display = 'inline-block';
        div.textContent = "saved";
        div.style.top = rect.top + scrollTop + 'px';       // set coordinates
        div.style.color = '#eff0f1';
        div.style.webkitTransition = 'opacity 2s';
        div.style.opacity = '1';
        div.style.position = 'absolute';
        div.style.zIndex = '1';
        div.style.textShadow = '0 0 20px #0c0d0e';
        div.style.boxShadow = '0px 0px 0px 1px black';


        document.body.appendChild(div);

        //var safeRanges = getSafeRanges(range);
        //for (var i = 0; i < safeRanges.length; i++) {
        //    highlightRange(safeRanges[i]);
        //}

        setTimeout(function () {
            removeHighlightAndToolTip(div);
        }, 1000);
    }
}

var domObjects = [];
function removeHighlightAndToolTip(div) {
    removeElement(div);
    //for (var i = 0; i < domObjects.length; i++) {
    //    removeElementStyle(domObjects[i]);
    //}
}

function removeElementStyle(domObjects) {
    $(domObjects).animate({
        backgroundColor: ""
    }, 1000);
}

function removeElement(domObjects) {
    domObjects.style.opacity = "0";
}

function highlightRange(range) {
    var newNode = document.createElement("div");
    domObjects.push(newNode);
    newNode.setAttribute(
        "style",
        "background-color: rgba(0, 149, 255, 0.38); display: inline;"
    );
    range.surroundContents(newNode);
}

function getSafeRanges(dangerous) {
    var a = dangerous.commonAncestorContainer;
    // Starts -- Work inward from the start, selecting the largest safe range
    var s = new Array(0), rs = new Array(0);
    if (dangerous.startContainer != a)
        for (var i = dangerous.startContainer; i != a; i = i.parentNode)
            s.push(i)
            ;
    if (0 < s.length) for (var i = 0; i < s.length; i++) {
        var xs = document.createRange();
        if (i) {
            xs.setStartAfter(s[i - 1]);
            xs.setEndAfter(s[i].lastChild);
        }
        else {
            xs.setStart(s[i], dangerous.startOffset);
            xs.setEndAfter(
                (s[i].nodeType == Node.TEXT_NODE)
                    ? s[i] : s[i].lastChild
            );
        }
        rs.push(xs);
    }

    // Ends -- basically the same code reversed
    var e = new Array(0), re = new Array(0);
    if (dangerous.endContainer != a)
        for (var i = dangerous.endContainer; i != a; i = i.parentNode)
            e.push(i)
            ;
    if (0 < e.length) for (var i = 0; i < e.length; i++) {
        var xe = document.createRange();
        if (i) {
            xe.setStartBefore(e[i].firstChild);
            xe.setEndBefore(e[i - 1]);
        }
        else {
            xe.setStartBefore(
                (e[i].nodeType == Node.TEXT_NODE)
                    ? e[i] : e[i].firstChild
            );
            xe.setEnd(e[i], dangerous.endOffset);
        }
        re.unshift(xe);
    }

    // Middle -- the uncaptured middle
    if ((0 < s.length) && (0 < e.length)) {
        var xm = document.createRange();
        xm.setStartAfter(s[s.length - 1]);
        xm.setEndBefore(e[e.length - 1]);
    }
    else {
        return [dangerous];
    }

    // Concat
    rs.push(xm);
    response = rs.concat(re);

    // Send to Console
    return response;
}

getSelectionRect();



