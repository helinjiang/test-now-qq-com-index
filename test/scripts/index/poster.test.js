const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：检查 poster 模块（NOW！直播你的生活）', function () {
    this.timeout(30000);

    describe('检查DOM元素及基本信息', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.display-show-poster')
                .evaluate(function () {
                    var containerDom = document.querySelector('#root .display-show-poster');
                    if (!containerDom) {
                        return null;
                    }

                    var result = {};

                    result.title = containerDom.querySelector('.display-show-title .section-title').innerHTML;
                    result.isExistPersion = !!containerDom.querySelector('.poster-wrap .poster .person');
                    result.isExistBullet = !!containerDom.querySelector('.poster-wrap .poster .bullet');

                    return result;
                })
                .end()
                .then(function (result) {
                    // { isExistPersion: true, isExistPoster: true, title: 'NOW！直播你的生活' }
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('标题为：NOW！直播你的生活', function () {
            expect(resultData.title).to.equal('NOW！直播你的生活');
        });

        it('人物大图存在', function () {
            expect(resultData.isExistPersion).to.be.true;
        });

        it('弹幕动画存在', function () {
            expect(resultData.isExistBullet).to.be.true;
        });

    });

});
