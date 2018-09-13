/**
 * Created by zhe.zhang on 2016/7/13.
 */
$(function () {
    $('#read').click(function () {
        chrome.runtime.sendMessage({method: 'read'}, function (res) {
            console.log(res);
        });
    });
    $('#write').click(function () {
        chrome.runtime.sendMessage({method: 'write'}, function (res) {
            console.log(res);
        });
    });
    $('#clear').click(function () {
        chrome.runtime.sendMessage({method: 'clear'}, function (res) {
            console.log(res);
        });
    });
});
