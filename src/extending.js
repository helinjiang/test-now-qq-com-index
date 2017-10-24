const Nightmare = require('nightmare');

Nightmare.action('size', function (done) {
    this.evaluate_now(() => {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return {
            height: h,
            width: w
        };
    }, done);
});

// exports.mouseover = function(selector, done) {
//     debug('.mouseover() on ' + selector);
//     this.evaluate_now(function (selector) {
//         var element = document.querySelector(selector);
//         if (!element) {
//             throw new Error('Unable to find element by selector: ' + selector);
//         }
//         var event = document.createEvent('MouseEvent');
//         event.initMouseEvent('mouseover', true, true);
//         element.dispatchEvent(event);
//     }, done, selector);
// };

Nightmare.action('myhover', function (selector, done) {
    this.evaluate_now((selector) => {
        var element = document.querySelector(selector);
        if (!element) {
            throw new Error('Unable to find element by selector: ' + selector);
        }
        var event = document.createEvent('MouseEvent');
        event.initMouseEvent('mouseenter', true, true);
        element.dispatchEvent(event);
    }, done, selector);
});

Nightmare({
    'proxy-server': '127.0.0.1:8080',
    'ignore-certificate-errors': true,
    show: true
})
    .goto('http://now.qq.com/index.html?now_n_http=1')
    .scrollTo(100, 0)
    .myhover('.header > .button')
    .wait(2000)
    .evaluate(function () {
        return window.getComputedStyle(
            document.querySelector('#root .qr-code'), null).display;
    })
    .end()
    .then(function (result) {
        console.log(result);
    })
    .catch(function (error) {
        console.error('failed:', error);
    });