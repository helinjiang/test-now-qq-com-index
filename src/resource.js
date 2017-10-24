const Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false });

var unkownArr = [],
    imgJpegArr = [],
    imgPngArr = [],
    imgWebpArr = [],
    jsArr = [],
    htmlArr = [],
    xhrArr = [],
    reportArr = [],
    otherTypeArr = [];

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
        console.log(resourceType, headers['content-type'], headers['content-length'], originalURL);
        var item = {
            resourceType: resourceType,
            headers: headers,
            contentType: headers['content-type'] && headers['content-type'][0] || '',
            contentLength: parseInt(headers['content-length'] || 0),
            originalURL: originalURL
        };

        if (!item.contentType) {
            if (isReportType(item)) {
                reportArr.push(item);
            } else {
                unkownArr.push(item);
            }
        } else {
            switch (item.contentType) {
                case 'image/jpeg':
                    imgJpegArr.push(item);
                    break;

                case 'image/png':
                    imgPngArr.push(item);
                    break;

                case 'image/webp':
                    imgWebpArr.push(item);
                    break;

                // js文件
                case 'application/x-javascript':
                    jsArr.push(item);
                    break;

                // html
                case 'text/html; charset=utf-8':
                    htmlArr.push(item);
                    break;

                default:
                    if (item.resourceType === 'xhr') {
                        xhrArr.push(item);
                    } else if (isReportType(item)) {
                        reportArr.push(item);
                    } else {
                        otherTypeArr.push(item);
                    }

                    break;
            }
        }
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

    // 资源加载完成之后再进行校验
    showInfo(htmlArr, 'html');
    showInfo(jsArr, 'js');
    showInfo(imgJpegArr, 'jpg');
    showInfo(imgPngArr, 'png');
    showInfo(imgWebpArr, 'webp');
    showInfo(xhrArr, 'xhr');
    showInfo(otherTypeArr, 'other');
    showInfo(unkownArr, 'unknown');
});

function isReportType(item) {
    return !!item.originalURL.match(/now\.qq\.com\/badjs\/|report\.url\.cn\/|/i);
}

function showInfo(arr, tag) {
    if (!arr || !arr.length) {
        return;
    }

    console.log('\n====' + tag + '====', arr.length);

    arr.sort(function (a, b) {
        return b.contentLength - a.contentLength;
    });

    arr.forEach(function (item) {
        console.log(item.originalURL, item.contentLength, (item.contentLength / 1024).toFixed(2) + 'kb');
    });
}

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