const Nightmare = require('nightmare');
const ivTesterResponse = require('./iv-tester-nightmare-response');

// 所有加载的数据
var handleResponse = new ivTesterResponse.HandleResponse('NOW官网PC首页资源加载');

var nightmare = Nightmare({ show: false });

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
    function (event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) {
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
        console.log(resourceType, headers['content-type'], headers['content-length'], originalURL);

        handleResponse.add(new ivTesterResponse.ResponseItem(event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType));
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
nightmare.on('did-get-redirect-request',
    function (event, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, referrer, headers) {
        console.log('[did-get-redirect-request]', oldURL, newURL, isMainFrame);
    });

// mp4播放
nightmare.on('media-started-playing', function () {
    console.log('[media-started-playing]');
});

// new-window
nightmare
    .goto('https://now.qq.com/index.html')
    .wait('#root')
    .wait(function (handleResponse) {
        return handleResponse.isLoaded;
    }, handleResponse)
    .end()
    .then(function () {
        // 打印加载情况
        handleResponse.toString();
        console.log(handleResponse.getCheckReportQuality());
        // console.log(handleResponse.getCheckReportNowH5([{
        //     opername: 'now_mob',
        //     module: 'download_page',
        //     description: '页面曝光',
        //     action: 'view'
        // }]));
    })
    .catch(function (error) {
        console.error('failed:', error);
    });
