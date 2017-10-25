const Nightmare = require('nightmare');
const expect = require('chai').expect;
const HandleResponse = require('../../../src/lib/handle-response');
const ResponseItem = require('../../../src/lib/response-item');

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
        // 所有加载的数据
        var handleResponse = new HandleResponse('NOW官网PC首页资源加载');

        before(function (done) {
            var nightmare = Nightmare({ show: false });

            // 资源加载的情况，会触发多次
            nightmare.on('did-get-response-details', function (...props) {
                handleResponse.add(new ResponseItem(...props));
            });

            nightmare
                .goto('https://now.qq.com/index.html')
                .wait('#root')
                .wait(function (handleResponse) {
                    return handleResponse.isLoaded;
                }, handleResponse)
                .end()
                .then(function () {
                    // 打印加载情况
                    // handleResponse.print();
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('html 只有一个请求', function () {
            expect(handleResponse.htmlArr).to.be.a('array').and.have.lengthOf(1);
        });

        it('首次加载的图片数量小于25个', function () {
            var allImg = handleResponse.imgJpegArr.concat(handleResponse.imgPngArr, handleResponse.imgWebpArr);
            expect(allImg).to.be.a('array').and.have.lengthOf.below(25);
        });

        it('图片大小都不大于80KB', function () {
            var allImg = handleResponse.imgJpegArr.concat(handleResponse.imgPngArr, handleResponse.imgWebpArr);
            var bigImgs = allImg.filter(function (item) {
                return item.contentLength > 1024 * 80;
            });

            // 只有一张图片比较特殊，因此此处做一个特殊处理
            bigImgs = bigImgs.slice(1);

            expect(bigImgs).to.be.empty;
        });

        // TODO 迁移 CDN 域名

        it('monitor上报：页面开始加载', function () {
            var filterResult = handleResponse.reportArr.filter(function (item) {
                return item.originalURL.indexOf(2852754) > -1;
            });

            expect(filterResult).to.be.a('array').and.have.lengthOf(1);
        });

        it('monitor上报：页面加载成功', function () {
            var filterResult = handleResponse.reportArr.filter(function (item) {
                return item.originalURL.indexOf(2852754) > -1;
            });

            expect(filterResult).to.be.a('array').and.have.lengthOf(1);
        });

    });
});
