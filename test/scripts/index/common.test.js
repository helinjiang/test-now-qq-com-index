const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：常规检查', function () {
    this.timeout(30000);

    describe('检查页面是否为直出', function () {
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
                expect(windowLocal.__initialState).to.have.keys('deviceInfo', 'mainInfo', 'networkInfo', 'newsInfo', 'playerInfo', 'recommendInfo', 'videoAnchorInfo', 'visibilityInfo');
            });

    });
});
