/**
 * Created by zhe.zhang on 2016/7/13.
 */
var tId;
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.method === 'post') {
        var msg = req.data;
        if (msg !== '') {
            window.localStorage.setItem('data', msg);
            sendResponse(1);
        } else {
            sendResponse(0);
        }
    }
    if (req.method === 'get') {
        var msg = window.localStorage.getItem('data');
        sendResponse(msg);
    }
    if (req.method === 'read') {
        chrome.tabs.sendMessage(tId, req);
        sendResponse(1);
    }
    if (req.method === 'write') {
        chrome.tabs.sendMessage(tId, req);
        sendResponse(1);
    }
    if (req.method === 'clear') {
        window.localStorage.removeItem('data');
        sendResponse('Clear Successful');
        sendResponse(1);
    }
});

chrome.tabs.onActivated.addListener(function(tab) {
    console.log(tab);
    tId = tab.tabId;
});