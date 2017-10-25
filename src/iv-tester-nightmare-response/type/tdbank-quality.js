const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('../util');
const RES_TYPE = require('../res-type');

module.exports = (name, allList) => {
    var errResult = [];

    // 有可能会分多次请求来上报，即type=RES_TYPE.REPORT_QUALITY会有多个，需要先合并
    var allCheckResult = [];
    var reportQualityList = allList.filter(item => (item.type === RES_TYPE.REPORT_QUALITY));

    reportQualityList.forEach((item) => {
        var originalURL = item.originalURL;

        // 获取query参数
        var params = util.getUrlQuery(originalURL);

        // 获取校验结果
        var checkResult = ivReportChecker.tdbank.getCheckQualityResult(params);

        if (checkResult.retCode !== 0) {
            // 本次校验失败
            errResult.push(`【${item.type}】校验失败！retCode=${checkResult.retCode}，originalURL=${originalURL}`);
        } else {
            // 本次校验成功，将结果进行合并，以便后续校验
            allCheckResult = allCheckResult.concat(checkResult.result);
        }
    });

    // 校验上报点个数是否为5
    if (allCheckResult.length !== 5) {
        errResult.push(`质量上报的上报点不正确，应该为5个上报点，实际只有${allCheckResult.length}个`);
    }

    // 校验各个上报点的各个字段是否正常
    allCheckResult.forEach((checkMap) => {
        let fieldList = Object.keys(checkMap);
        fieldList.forEach((field) => {
            let item = checkMap[field];
            if (!item.isValid) {
                errResult.push(`【${name}】【${checkMap.busi_name.value}】【${checkMap.action.value}】字段${item.field}校验失败（上报值为：${item.value}），失败原因： ${item.description}`);
            }
        });
    });

    return errResult;
};