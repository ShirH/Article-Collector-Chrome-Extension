function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function saveData(uPageUrl, sMenuItemId, sSelectionText, tab) {
    updateSavedObject(uPageUrl, sMenuItemId, sSelectionText, tab);
}

function updateSavedObject(uPageUrl, sMenuItemId, sSelectionText, tab) {
    chrome.storage.sync.get(uPageUrl, function (oSavedData) {
        var oData = oSavedData || {};
        if (!oData[uPageUrl]) {
            sNumOfItems = JSON.stringify(parseInt(sNumOfItems) + 1);
        }
        if (!oData[uPageUrl] || (oData[uPageUrl] && !oData[uPageUrl][sMenuItemId]) || (oData[uPageUrl][sMenuItemId] && window.confirm("A " + sMenuItemId + " for this page already exists are you sure you want to change it?"))) {
            saveToStorage(oData, sMenuItemId, uPageUrl, sSelectionText, tab);
        }
    });
}

function saveToStorage(oData, sMenuItemId, uPageUrl, sSelectionText, tab) {
    oData[uPageUrl] = oData[uPageUrl] || {};
    oData[uPageUrl][sMenuItemId] = sSelectionText || "";
    chrome.storage.sync.set(oData, function () {
        chrome.browserAction.setBadgeText({text: sNumOfItems});
        console.log("Article Collector: Saving data succeed");
        chrome.tabs.executeScript(tab.id, {file: "jquery-3.2.0.min.js"}, function () {
            chrome.tabs.executeScript(tab.id, {file: "jquery-1.10.4-ui.min.js"}, function () {
                chrome.tabs.executeScript(tab.id, {
                    file: "getDOM.js",
                });
            });
        });
    });
}


function placeTooltip(x_pos, y_pos) {
    var d = document.getElementById('tooltip');
    d.style.position = "absolute";
    d.style.left = x_pos + 'px';
    d.style.top = y_pos + 'px';
}

var sNumOfItems;
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(null, function (items) {
        sNumOfItems = JSON.stringify(Object.keys(items).length);
        chrome.browserAction.setBadgeText({text: sNumOfItems});
        chrome.browserAction.setBadgeBackgroundColor({color: "#008080"});
    });
});

chrome.runtime.onInstalled.addListener(creatContextMenues);

chrome.contextMenus.onClicked.addListener(onContextMenuChoose);

document.addEventListener('copy', function (e) {
    e.clipboardData.setData('text/html ', sTextToCopy);
    e.preventDefault(); // default behaviour is to copy any selected text
});

function onContextMenuChoose(info, tab) {
    if (info) {
        if (info.menuItemId !== "copyAllItemsToCB" && info.menuItemId !== "clearAllItemsToCB") {
            var sSelectionText = info.selectionText;
            var sMenuItemId = info.menuItemId;
            var uPageUrl = info.pageUrl;
            saveData(uPageUrl, sMenuItemId, sSelectionText, tab);
        } else {
            if (info.menuItemId === "copyAllItemsToCB") {
                getAllData();
            } else {
                if (window.confirm("Do you really want to clear all items?")) {
                    clearData();
                }
            }
        }
    }
}

function getAllData() {
    chrome.storage.sync.get(null, function (i) {
        copyTextToClipBoard(i);
    });
}

var sTextToCopy;
function copyTextToClipBoard(oSavedItems) {
    sTextToCopy = "";
    for (var key in oSavedItems) {
        // skip loop if the property is from prototype
        if (!oSavedItems.hasOwnProperty(key)) continue;
        var obj = oSavedItems[key];

        if (obj.headline) {
            insetNewHtmlHeadline("<br>" + obj.headline)
            insertNewHtmlHerfLine(key);
        } else {
            insertNewHtmlHerfLine("<br>" + key);
        }

        if (obj.byline) {
            insertNewHtmlTextLine(obj.byline)
        }

        if (obj.subhead) {
            insertNewHtmlTextLine(obj.subhead + "<br><br>")
        }
    }
    document.execCommand('copy');
}


function insertNewHtmlTextLine(stringToAdd) {
    insertPLabele("<span lang='HE'> \n " + stringToAdd + " \n <o:p></o:p> \n </span>");
}

function insertPLabele(stringToadd) {
    sTextToCopy = sTextToCopy + "<p class='MsoNormal' dir='RTL' style='text-align:right;direction:rtl;unicode-bidi:embed'>\n" + stringToadd + " \n </p> \n";

}

function insetNewHtmlHeadline(headlineToAdd) {
    insertPLabele("<b> \n <span lang='HE'>" + headlineToAdd + "<o:p></o:p></span>\n</b>\n");
}

function insertNewHtmlHerfLine(sLinkToAdd) {
    insertNewHtmlTextLine("<a href=" + sLinkToAdd + "><span dir='LTR'>" + sLinkToAdd + "</span></a>");
}

function clearData() {
    chrome.storage.sync.clear(function () {
        sNumOfItems = "0";
        chrome.browserAction.setBadgeText({text: sNumOfItems});
        console.log("Article Collector: Clear data succeed")
    });
}

chrome.commands.onCommand.addListener(function (command) {
    var info = {};
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function (selection) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            info.menuItemId = command;
            info.selectionText = selection[0];
            info.pageUrl = tabs[0].url;
            onContextMenuChoose(info, tabs[0]);
        });
    });
});

function creatContextMenues() {
    var titleFirstLevel = "add new item";
    chrome.contextMenus.create({
        "title": titleFirstLevel,
        "contexts": ["selection"],
        "id": "firstLevelContextMenuNewsExtension"
    });
    var titelSecondLevelHeadline = "add new Headline";
    chrome.contextMenus.create({
        "title": titelSecondLevelHeadline,
        "contexts": ["selection"],
        "id": "headline",
        "parentId": "firstLevelContextMenuNewsExtension"
    });
    var titelSecondLevelSubhead = "add new Subhead";
    chrome.contextMenus.create({
        "title": titelSecondLevelSubhead,
        "contexts": ["selection"],
        "id": "subhead",
        "parentId": "firstLevelContextMenuNewsExtension"
    });
    var titelSecondLevelByline = "add new Byline";
    chrome.contextMenus.create({
        "title": titelSecondLevelByline,
        "contexts": ["selection"],
        "id": "byline",
        "parentId": "firstLevelContextMenuNewsExtension"
    });
    chrome.contextMenus.create({
        "id": "copyAllItemsToCB",
        "title": "Copy all items",
        "contexts": ["browser_action"]
    });
    chrome.contextMenus.create({
        "id": "clearAllItemsToCB",
        "title": "Clear all items",
        "contexts": ["browser_action"]
    });
}

//chrome.browserAction.onClicked.addListener(function () {
//    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//        chrome.tabs.sendMessage(tabs[0].id, "toggleArticleCollectorSideBar");
//    })
//});


