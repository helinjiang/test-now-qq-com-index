const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('./util');
const RES_TYPE = require('./res-type');
const getCheckTdbankQualityResult = require('./type/tdbank-quality');

class HandleResponse {
    constructor(name) {
        this.name = name;

        this.isLoaded = false;
        this.allList = [];
    }

    add(item) {
        var originalURL = item.originalURL;

        // 分门别类进行识别
        if (ivReportChecker.monitor.isReportToMonitor(originalURL)) {
            item.type = RES_TYPE.MONITOR;
        } else if (ivReportChecker.tdbank.isReportToNowH5(originalURL)) {
            item.type = RES_TYPE.REPORT_NOW_H5;
        } else if (ivReportChecker.tdbank.isReportToQuality(originalURL)) {
            item.type = RES_TYPE.REPORT_QUALITY;
        } else if (ivReportChecker.badjs.isReportToBadjs(originalURL)) {
            item.type = RES_TYPE.BADJS;
        } else if (!item.contentType) {
            item.type = RES_TYPE.OTHER;
        } else {
            switch (item.contentType) {
                case 'image/jpeg':
                    item.type = RES_TYPE.JPEG;
                    break;

                case 'image/png':
                    item.type = RES_TYPE.PNG;
                    break;

                case 'image/webp':
                    item.type = RES_TYPE.WEBP;
                    break;

                // js文件
                case 'application/x-javascript':
                    item.type = RES_TYPE.JS;
                    break;

                // html
                case 'text/html; charset=utf-8':
                    item.type = RES_TYPE.HTML;
                    break;

                default:
                    if (item.resourceType === 'xhr') {
                        item.type = RES_TYPE.XHR;
                    } else {
                        item.type = RES_TYPE.OTHER;
                    }

                    break;
            }
        }

        // 缓存数据
        this.allList.push(item);

        // 检查下是否已经加载完成，如果不人为控制的话，可以在 did-finish-load 事件中设置
        if (this._checkIfLoaded(item)) {
            this.isLoaded = true;
        }
    }

    getCheckReportNowH5(reportItemList = []) {
        var errResult = [];

        // 有可能会分多次请求来上报，即type=RES_TYPE.REPORT_NOW_H5会有多个，需要先合并
        var allCheckResult = [];
        var reportNowH5List = this.allList.filter(item => (item.type === RES_TYPE.REPORT_NOW_H5));

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

        // 校验上报点个数是否为1
        if (allCheckResult.length !== 1) {
            errResult.push(`业务上报的上报点不正确，应该为1个上报点，实际只有${allCheckResult.length}个`);
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
                    errResult.push(`【${this.name}】【${checkMap.action.value}-${checkMap.action.description}】字段${item.field}校验失败（上报值为：${item.value}），失败原因： ${item.description}`);
                }
            });
        });

        return errResult;
    }

    getCheckReportQuality() {
        return getCheckTdbankQualityResult(this.name, this.allList);
    }

    toString() {
        this._printOne(this.allList, 'ALL');
    }

    _printOne(arr, tag) {
        if (!arr || !arr.length) {
            return;
        }

        console.log('\n====' + tag + '====', arr.length);

        arr.sort(function (a, b) {
            return b.contentLength - a.contentLength;
        });

        arr.forEach(function (item) {
            item.toString();
        });
    }

    _checkIfLoaded(item) {
        return !!item.originalURL.match(/table_id=personal_live_base/i);
    }
}

module.exports = HandleResponse;