const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('官网PC端首页：检查 download 模块', function () {
    this.timeout(30000);

    describe('检查DOM元素及基本信息', function () {
        var resultData;

        before(function (done) {
            Nightmare()
                .goto('https://now.qq.com')
                .wait('.display-show-download')
                .evaluate(function () {
                    var containerDom = document.querySelector('#root .display-show-download');
                    if (!containerDom) {
                        return null;
                    }

                    var result = {};

                    result.title = containerDom.querySelector('.display-show-title .section-title').innerHTML;
                    result.isExistDownloadImg = !!containerDom.querySelectorAll('.download-bg');

                    return result;
                })
                .end()
                .then(function (result) {
                    // { isExistDownloadImg: true, title: 'NOW！邀您体验全民直播时代' }
                    // console.log(result);
                    resultData = result;
                    done();
                })
                .catch(function (error) {
                    console.error('failed:', error);
                    done();
                });
        });

        it('标题为：NOW！邀您体验全民直播时代', function () {
            expect(resultData.title).to.equal('NOW！邀您体验全民直播时代');
        });

        it('下载大图存在', function () {
            expect(resultData.isExistDownloadImg).to.be.true;
        });

    });

});
