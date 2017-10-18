const Nightmare = require('nightmare');
const expect = require('chai').expect;

describe('index.html banner', function () {
    this.timeout(30000);

    describe('check nav menu', function () {
        var resultData;

        before(function (done) {
            var nightmare = Nightmare({
                show: true
            });

            nightmare
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

        it('resultData is array and have 4 element', function () {
            expect(resultData).to.be.an('array').that.have.lengthOf(4);
        });

        it('first element is index.html and is active', function () {
            expect(resultData[0]).to.eql({
                className: 'active',
                name: '首页',
                url: '//now.qq.com/index.html'
            });
        });

        it('second element is news.html', function () {
            expect(resultData[1]).to.eql({
                className: '',
                name: '最新动态',
                url: '//now.qq.com/news.html'
            });
        });

        it('third element is operation system', function () {
            expect(resultData[2]).to.eql({
                className: '',
                name: '机构入驻',
                url: '//now.qq.com/operation/notify'
            });
        });

        it('fourth element is contact.html', function () {
            expect(resultData[3]).to.eql({
                className: '',
                name: '联系我们',
                url: '//now.qq.com/contact.html'
            });
        });

    });
});
