const Nightmare = require('nightmare');

var nightmare = Nightmare({ show: false });

// 所有加载的数据
var loadData = {
    isLoaded: false,
    unkownArr: [],
    imgJpegArr: [],
    imgPngArr: [],
    imgWebpArr: [],
    jsArr: [],
    htmlArr: [],
    xhrArr: [],
    reportArr: [],
    otherTypeArr: []
};

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

        var item = {
            resourceType: resourceType,
            headers: headers,
            contentType: headers['content-type'] && headers['content-type'][0] || '',
            contentLength: parseInt(headers['content-length'] || 0),
            originalURL: originalURL
        };

        dealResponseDetail(item);
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
    .wait(function (checkData) {
        return checkData.isLoaded;
    }, loadData)
    .end()
    .then(function (result) {
        console.log(result);

        // 打印加载情况
        printResponseDetail(loadData);
    })
    .catch(function (error) {
        console.error('failed:', error);
    });

function dealResponseDetail(item) {
    if (!item.contentType) {
        if (isReportType(item)) {
            loadData.reportArr.push(item);
        } else {
            loadData.unkownArr.push(item);
        }
    } else {
        switch (item.contentType) {
            case 'image/jpeg':
                loadData.imgJpegArr.push(item);
                break;

            case 'image/png':
                loadData.imgPngArr.push(item);
                break;

            case 'image/webp':
                loadData.imgWebpArr.push(item);
                break;

            // js文件
            case 'application/x-javascript':
                loadData.jsArr.push(item);
                break;

            // html
            case 'text/html; charset=utf-8':
                loadData.htmlArr.push(item);
                break;

            default:
                if (item.resourceType === 'xhr') {
                    loadData.xhrArr.push(item);
                } else if (isReportType(item)) {
                    loadData.reportArr.push(item);
                } else {
                    loadData.otherTypeArr.push(item);
                }

                break;
        }
    }

    // 检查下是否已经加载完成，如果不人为控制的话，可以在 did-finish-load 事件中设置
    if (checkIfLoaded(item)) {
        loadData.isLoaded = true;
    }
}

function printResponseDetail(loadData) {
    showInfo(loadData.htmlArr, 'html');
    showInfo(loadData.jsArr, 'js');
    showInfo(loadData.imgJpegArr, 'jpg');
    showInfo(loadData.imgPngArr, 'png');
    showInfo(loadData.imgWebpArr, 'webp');
    showInfo(loadData.xhrArr, 'xhr');
    showInfo(loadData.reportArr, 'report');
    showInfo(loadData.otherTypeArr, 'other');
    showInfo(loadData.unkownArr, 'unknown');
}

function isReportType(item) {
    return !!item.originalURL.match(/now\.qq\.com\/badjs\/|report\.url\.cn\//i);
}

function checkIfLoaded(item) {
    return !!item.originalURL.match(/table_id=personal_live_base/i);
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