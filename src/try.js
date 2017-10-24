const Nightmare = require('nightmare');

var nightmare = Nightmare({
  'proxy-server': '127.0.0.1:8080',
  'ignore-certificate-errors': true,
  show: true
});

nightmare
    .goto('http://now.qq.com/index.html?now_n_http=1')
    .wait('.qr-code')
    .scrollTo(100, 0)
    .mouseover('.header > .button')
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

// nightmare
//   .goto('http://now.qq.com/index.html?now_n_http=1')
//   .wait('.qr-code')
//   .scrollTo(100, 0)
//   .wait(2000)
//   .mouseover('.header > .button')
//   .wait(2000)
//   .mousedown('.header > .button').wait(2000)
//   .mouseup('.header > .button').wait(2000)
//   .click('.header > .button')
//   .wait(2000)
//   .screenshot('test.png')
//   .evaluate(function () {
//     return window.getComputedStyle(
//       document.querySelector('#root .qr-code'), null).display;
//   })
//   .end()
//   .then(function (result) {
//     console.log(result);
//   })
//   .catch(function (error) {
//     console.error('failed:', error);
//   });