const url = require('url');

/**
 * 获取查询参数
 * @param {String} urlPath
 * @param {String} name
 * @return {String}
 */
function query(urlPath, name) {

    let value = urlPath.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'))
        ? decodeURIComponent(RegExp.$2) : '';

    if (value.match(/<\/?script>/i)) {
        value = value.replace(/<\/?script>/ig, '');
    }

    return value;
}

/**
 * 获取 URL 地址中的query参数对象
 * @param {String} urlStr
 * @return {Object}
 */
function getUrlQuery(urlStr) {
    return url.parse(urlStr, true).query || {};
}

module.exports = {
    query: query,
    getUrlQuery: getUrlQuery
};