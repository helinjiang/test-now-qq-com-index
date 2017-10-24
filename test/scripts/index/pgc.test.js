const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：检查 pgc 模块（NOW！总会有人关注你）', function () {
    this.timeout(30000);

    describe('检查DOM元素及基本信息', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.display-show-pgc')
                .evaluate(function () {
                    var containerDom = document.querySelector('#root .display-show-pgc');
                    if (!containerDom) {
                        return null;
                    }

                    var result = {};

                    result.title = containerDom.querySelector('.display-show-title .section-title').innerHTML;
                    result.length = containerDom.querySelectorAll('.pgc-list .display-show-pgc-pic-card').length;

                    var firstDom = containerDom.querySelectorAll('.pgc-list .display-show-pgc-pic-card')[0];
                    result.isExistSmall = !!firstDom.querySelector('.item-small');
                    result.isExistBig = !!firstDom.querySelector('.item-big');

                    return result;
                })
                .end()
                .then(function (result) {
                    // { isExistBig: true, isExistSmall: true, length: 8, title: 'NOW！总会有人关注你' }
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('标题为：NOW！总会有人关注你', function () {
            expect(resultData.title).to.equal('NOW！总会有人关注你');
        });

        it('主播展示个数为8个', function () {
            expect(resultData.length).to.equal(8);
        });

        it('人物大图存在', function () {
            expect(resultData.isExistBig).to.be.true;
        });

        it('人物小图存在', function () {
            expect(resultData.isExistSmall).to.be.true;
        });

    });

});
