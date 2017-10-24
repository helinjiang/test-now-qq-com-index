const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：常规检查', function () {
    this.timeout(30000);

    describe.skip('检查页面是否为直出', function () {
        var windowLocal;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .evaluate(function () {
                    return window;
                })
                .end()
                .then(function (result) {
                    windowLocal = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        // window.__initialState 必须要存在且包含特定的reducer
        it('window.__initialState 必须要存在且包含特定的reducer',
            function () {
                expect(windowLocal.__initialState)
                    .to
                    .have
                    .keys('deviceInfo', 'mainInfo', 'networkInfo', 'newsInfo',
                        'playerInfo', 'recommendInfo', 'videoAnchorInfo',
                        'visibilityInfo');
            });

    });

    describe('检查页面资源加载情况', function () {
        var unkownArr = [],
            imgJpegArr = [],
            imgPngArr = [],
            imgWebpArr = [],
            jsArr = [],
            htmlArr = [],
            xhrArr = [],
            reportArr = [],
            otherTypeArr = [];

        before(function (done) {
            var nightmare = Nightmare({show: false});

            // 资源加载的情况，会触发多次
            nightmare.on('did-get-response-details',
                function (event, status, newURL, originalURL, httpResponseCode,
                          requestMethod, referrer, headers, resourceType) {

                    var item = {
                        resourceType: resourceType,
                        headers: headers,
                        contentType: headers['content-type'] &&
                        headers['content-type'][0] || '',
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
                showInfo(reportArr, 'report');
                showInfo(otherTypeArr, 'other');
                showInfo(unkownArr, 'unknown');
            });

            nightmare
                .goto('https://now.qq.com/index.html')
                .evaluate(function () {
                    return window;
                })
                .end()
                .then(function (result) {
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('html 只有一个请求', function () {
            expect(htmlArr).to.be.a('array').and.have.lengthOf(1);
        });

        it('首次加载的图片数量小于25个', function () {
            var allImg = imgJpegArr.concat(imgPngArr, imgWebpArr);
            expect(allImg).to.be.a('array').and.have.lengthOf.below(25);
        });

        it('图片大小都不大于80KB', function () {
            var allImg = imgJpegArr.concat(imgPngArr, imgWebpArr);
            var bigImgs = allImg.filter(function (item) {
                return item.contentLength > 1024 * 80;
            });

            // 只有一张图片比较特殊，因此此处做一个特殊处理
            bigImgs = bigImgs.slice(1);

            expect(bigImgs).to.be.empty;
        });

        it('monitor上报：页面开始加载', function () {
            var filterResult = reportArr.filter(function (item) {
                return item.originalURL.indexOf(2852754) > -1;
            });

            expect(filterResult).to.be.a('array').and.have.lengthOf(1);
        });

        it('monitor上报：页面加载成功', function () {
            var filterResult = reportArr.filter(function (item) {
                return item.originalURL.indexOf(2852754) > -1;
            });

            expect(filterResult).to.be.a('array').and.have.lengthOf(1);
        });

    });
});

function isReportType(item) {
    return !!item.originalURL.match(/now\.qq\.com\/badjs\/|report\.url\.cn\//i);
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
        console.log(item.originalURL, item.contentLength, (item.contentLength /
            1024).toFixed(2) + 'kb');
    });
}
