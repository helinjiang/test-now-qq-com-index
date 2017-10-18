const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('index.html common check', function () {
    this.timeout(30000);

    describe('check window local', function () {
        var windowLocal;

        before(function (done) {
            var nightmare = Nightmare();

            nightmare
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

        // window 对象必须是一个对象
        it('window should be object', function () {
            expect(windowLocal).to.be.an('object');
        });

        // window.__initialState 必须要存在且包含特定的reducer
        it('window.__initialState should be object and have some keys',
            function () {
                expect(windowLocal.__initialState)
                    .to
                    .have
                    .keys('deviceInfo', 'mainInfo', 'networkInfo', 'newsInfo',
                        'playerInfo', 'recommendInfo', 'videoAnchorInfo',
                        'visibilityInfo');
            });

    });
});
