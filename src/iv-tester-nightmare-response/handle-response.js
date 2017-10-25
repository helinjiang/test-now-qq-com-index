const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('./util');
const RES_TYPE = require('./res-type');
const getCheckTdbankQualityResult = require('./type/tdbank-quality');
const getCheckTdbankNowH5Result = require('./type/tdbank-now-h5');

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
        return getCheckTdbankNowH5Result(this.name, this.allList, reportItemList);
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