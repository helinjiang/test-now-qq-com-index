const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('../util');
const RES_TYPE = require('../res-type');

/**
 * 获得校验业务上报的结果
 *
 * @param {String} name 名字，用于区别日志信息
 * @param {Array} allList 所有的资源列表
 * @param {Array} reportItemList 上报点数组
 * @param {Number} [checkSize] 限制的上报数量，可以校验多上报或者少上报的情况
 * @return {Array}
 */
module.exports = (name, allList, reportItemList = [], checkSize) => {
    var errResult = [];

    // 有可能会分多次请求来上报，即type=RES_TYPE.REPORT_NOW_H5会有多个，需要先合并
    var allCheckResult = [];
    var reportNowH5List = allList.filter(item => (item.type === RES_TYPE.REPORT_NOW_H5));

    reportNowH5List.forEach((item) => {
        var originalURL = item.originalURL;

        // 获取query参数
        var params = util.getUrlQuery(originalURL);

        // 获取校验结果
        var checkResult = ivReportChecker.tdbank.getCheckNowH5Result(params, null, {
            reportItemList: reportItemList
        });

        if (checkResult.retCode !== 0) {
            // 本次校验失败
            errResult.push(`【${item.type}】校验失败！retCode=${checkResult.retCode}，originalURL=${originalURL}`);
        } else {
            // 本次校验成功，将结果进行合并，以便后续校验
            allCheckResult = allCheckResult.concat(checkResult.result);
        }
    });

    // 校验上报点个数是否为checkSize，只有在设置了这个参数时才启动校验
    if ((typeof checkSize !== 'undefined') && allCheckResult.length !== checkSize) {
        errResult.push(`业务上报的上报点不正确，应该为${checkSize}个上报点，实际只有${allCheckResult.length}个`);
    }

    // 校验各个上报点的各个字段是否正常
    allCheckResult.forEach((checkMap) => {
        let fieldList = Object.keys(checkMap);

        // 这种判断方式不是最佳的，应该要预留一个方法出来
        if (checkMap.action.value === checkMap.action.description) {
            errResult.push('未匹配的上报检查');
            return;
        }

        fieldList.forEach((field) => {
            let item = checkMap[field];
            if (!item.isValid) {
                errResult.push(`【${name}】【${checkMap.action.value}-${checkMap.action.description}】字段${item.field}校验失败（上报值为：${item.value}），失败原因： ${item.description}`);
            }
        });
    });

    return errResult;
};