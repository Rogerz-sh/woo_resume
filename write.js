/**
 * Created by zhe.zhang on 2016/7/13.
 */
$(function () {
    chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
        if (req.method === 'write') {
            chrome.runtime.sendMessage({method: 'get'}, function (res) {
                //res is the person data
                window.localStorage.setItem('data', res);
                injectScript();
            });
        }
    });

    function injectScript() {
        var script = document.createElement('script');
        script.src = './extension/data.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }
});