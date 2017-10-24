const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：检查 banner 模块', function () {
    this.timeout(30000);

    describe('检查DOM元素及基本信息', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.display-show-banner')
                .evaluate(function () {
                    var containerDom = document.querySelector('#root .display-show-banner');
                    if (!containerDom) {
                        return null;
                    }

                    var result = {};

                    result.isExistTitle = !!containerDom.querySelector('.header .title');
                    result.isExistQrCode = !!containerDom.querySelector('.header .button');
                    result.isExistBg = !!containerDom.querySelector('.bg-wrap');
                    result.isExistVideo = !!containerDom.querySelector('.bg-wrap .video-wrap video');

                    return result;
                })
                .end()
                .then(function (result) {
                    // {"isExistTitle":true,"isExistQrCode":true,"isExistBg":true,"isExistVideo":true}
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('存在导航栏', function () {
            expect(resultData.isExistTitle).to.be.true;
        });

        it('存在二维码', function () {
            expect(resultData.isExistQrCode).to.be.true;
        });

        it('存在背景图', function () {
            expect(resultData.isExistBg).to.be.true;
        });

        it('存在视频', function () {
            expect(resultData.isExistVideo).to.be.true;
        });

    });

    describe('检查菜单导航栏', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.display-show-banner')
                .evaluate(function () {
                    var allLi = document.querySelectorAll(
                        '#root .display-show-banner .header .title ul li');

                    var result = [];

                    Array.from(allLi).forEach(function (item) {
                        result.push({
                            name: item.innerText,
                            className: item.getAttribute('class') || '',
                            url: item.querySelector('a').getAttribute('href')
                        });
                    });

                    return result;
                })
                .end()
                .then(function (result) {
                    // [{"name":"首页","className":"active","url":"//now.qq.com/index.html"},{"name":"最新动态","className":null,"url":"//now.qq.com/news.html"},{"name":"机构入驻","className":null,"url":"//now.qq.com/operation/notify"},{"name":"联系我们","className":null,"url":"//now.qq.com/contact.html"}]
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('导航栏有四个导航地址', function () {
            expect(resultData).to.be.an('array').that.have.lengthOf(4);
        });

        it('第一个菜单为：首页，且为激活状态', function () {
            expect(resultData[0]).to.eql({
                className: 'active',
                name: '首页',
                url: '//now.qq.com/index.html'
            });
        });

        it('第二个菜单为：最新动态', function () {
            expect(resultData[1]).to.eql({
                className: '',
                name: '最新动态',
                url: '//now.qq.com/news.html'
            });
        });

        it('第三个菜单为：机构入驻', function () {
            expect(resultData[2]).to.eql({
                className: '',
                name: '机构入驻',
                url: '//now.qq.com/operation/notify'
            });
        });

        it('第四个菜单为：联系我们', function () {
            expect(resultData[3]).to.eql({
                className: '',
                name: '联系我们',
                url: '//now.qq.com/contact.html'
            });
        });

    });

    describe('检查下载二维码', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.qr-code')
                .scrollTo(100, 0)
                .mouseover('.header > .button')
                .evaluate(function () {
                    return window.getComputedStyle(
                        document.querySelector('#root .qr-code'), null).display;
                })
                .end()
                .then(function (result) {
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('鼠标移动到按钮上时出现二维码', function () {
            expect(resultData).to.equal('block');
        });

    });

});
