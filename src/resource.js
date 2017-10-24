const Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true });

nightmare.on('console', function (type, msg) {
    console[type](msg);
});

// nightmare.on('page', function (type = 'error', message, stack) {
//     console[type](message);
// });

// 页面开始加载之前触发，只触发一次
nightmare.on('did-start-loading', function () {
    console.log('[did-start-loading]');
});

// 资源加载的情况，会触发多次
nightmare.on('did-get-response-details',
    function (event, status, newURL, originalURL, httpResponseCode,
              requestMethod, referrer, headers, resourceType) {
        // console.log('\n');
        /**
         event Event
         status Boolean
         newURL String
         originalURL String
         httpResponseCode Integer
         requestMethod String
         referrer String
         headers Object
         resourceType String
         */
        console.log(resourceType, headers['content-length'], originalURL);
    });

// mainFrame本身（即html文件）加载完成即触发，在did-frame-finish-load之前
nightmare.on('dom-ready', function (event) {
    console.log('[dom-ready]', event);
});

// mainFrame undefined https://now.qq.com/
// html 页面加载完成就触发，此时其他资源不一定加载完成了，只触发一次
nightmare.on('did-frame-finish-load', function (event, isMainFrame) {
    console.log('[did-frame-finish-load]', event, isMainFrame);
});

// 页面加载完成时触发，相当于 onload，只触发一次
nightmare.on('did-finish-load', function () {
    console.log('[did-finish-load]');
});

// 页面停止加载时触发，只触发一次，在 did-finish-load 之后
nightmare.on('did-stop-loading', function () {
    console.log('[did-stop-loading]');
});

// 重定向时触发，例如可以构造一个404才测试
nightmare.on('did-get-redirect-request', function (event, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, referrer, headers) {
    console.log('[did-get-redirect-request]', oldURL, newURL, isMainFrame);
});

// mp4播放
nightmare.on('media-started-playing', function () {
    console.log('[media-started-playing]');
});

// new-window

nightmare
    .goto('https://now.qq.com/index.html')
    .wait('.display-show-pgc')
    .evaluate(function () {
        var containerDom = document.querySelector('#root .display-show-pgc');
        if (!containerDom) {
            return null;
        }

        var result = {};

        result.title = containerDom.querySelector('.display-show-title .section-title').innerHTML;

        return result;
    })
    .end()
    .then(function (result) {
        // { isExistPersion: true, isExistPoster: true, title: 'NOW！直播你的生活' }
        console.log(result);
    })
    .catch(function (error) {
        console.error('failed:', error);
    });