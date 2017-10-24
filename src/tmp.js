const Nightmare = require('nightmare');
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
        result.isExistSmall= !!firstDom.querySelector('.item-small');
        result.isExistBig= !!firstDom.querySelector('.item-big');

        return result;
    })
    .end()
    .then(function (result) {
        // { isExistPersion: true, isExistPoster: true, title: 'NOW！直播你的生活' }
        console.log(result);
    })
    .catch(function (error) {
        console.error('failed:', error);
    });