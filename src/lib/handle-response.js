const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('./util');

class HandleResponse {
    constructor(name) {
        this.name = name;

        this.isLoaded = false;
        this.unkownArr = [];
        this.imgJpegArr = [];
        this.imgPngArr = [];
        this.imgWebpArr = [];
        this.jsArr = [];
        this.htmlArr = [];
        this.xhrArr = [];
        this.reportArr = [];
        this.otherTypeArr = [];
    }

    add(item) {
        if (!item.contentType) {
            if (this._isReportType(item)) {
                this.reportArr.push(item);
            } else {
                this.unkownArr.push(item);
            }
        } else {
            switch (item.contentType) {
                case 'image/jpeg':
                    this.imgJpegArr.push(item);
                    break;

                case 'image/png':
                    this.imgPngArr.push(item);
                    break;

                case 'image/webp':
                    this.imgWebpArr.push(item);
                    break;

                // js文件
                case 'application/x-javascript':
                    this.jsArr.push(item);
                    break;

                // html
                case 'text/html; charset=utf-8':
                    this.htmlArr.push(item);
                    break;

                default:
                    if (item.resourceType === 'xhr') {
                        this.xhrArr.push(item);
                    } else if (this._isReportType(item)) {
                        this.reportArr.push(item);
                    } else {
                        this.otherTypeArr.push(item);
                    }

                    break;
            }
        }

        // 检查下是否已经加载完成，如果不人为控制的话，可以在 did-finish-load 事件中设置
        if (this._checkIfLoaded(item)) {
            this.isLoaded = true;
        }
    }

    setIsLoaded() {
        this.isLoaded = true;
    }

    getCheckReportNowH5() {
        // TODO 此处可能会有多次请求
        var urlStr;
        for (var i = 0; i < this.reportArr.length; i++) {
            if (this.reportArr[i].originalURL.match(/table_id=personal_live_base/i)) {
                urlStr = this.reportArr[i].originalURL;
                break;
            }
        }

        if (!urlStr) {
            return null;
        }

        var params = util.getUrlQuery(urlStr);
        var checkResult = ivReportChecker.tdbank.getCheckNowH5Result(params, null, {
            reportItemList: [{
                opername: 'now_mob',
                module: 'download_page',
                description: '页面曝光',
                action: 'view'
            }]
        });

        if (checkResult.retCode !== 0) {
            return null;
        }

        var arr = [];

        checkResult.result.forEach((checkMap) => {
            let fieldList = Object.keys(checkMap);

            // 这种判断方式不是最佳的，应该要预留一个方法出来
            if (checkMap.action.value === checkMap.action.description) {
                arr.push('未匹配的上报检查');
                return;
            }

            fieldList.forEach((field) => {
                let item = checkMap[field];
                if (!item.isValid) {
                    arr.push(`【${this.name}】【${checkMap.action.value}-${checkMap.action.description}】字段${item.field}校验失败（上报值为：${item.value}），失败原因： ${item.description}`);
                }
            });
        });

        return arr;
    }

    getCheckReportQuality() {
        // TODO 此处可能会有多次请求
        var urlStr;
        for (var i = 0; i < this.reportArr.length; i++) {
            if (this.reportArr[i].originalURL.match(/table_id=now_page_quality_statistics/i)) {
                urlStr = this.reportArr[i].originalURL;
                break;
            }
        }

        if (!urlStr) {
            return null;
        }

        var params = util.getUrlQuery(urlStr);

        var checkResult = ivReportChecker.tdbank.getCheckQualityResult(params);
        if (checkResult.retCode !== 0) {
            return null;
        }

        var arr = [];

        checkResult.result.forEach((checkMap) => {
            let fieldList = Object.keys(checkMap);
            fieldList.forEach((field) => {
                let item = checkMap[field];
                if (!item.isValid) {
                    arr.push(`【${this.name}】【${checkMap.busi_name.value}】【${checkMap.action.value}】字段${item.field}校验失败（上报值为：${item.value}），失败原因： ${item.description}`);
                }
            });
        });

        return arr;
    }

    toString() {
        this._printOne(this.htmlArr, 'html');
        this._printOne(this.jsArr, 'js');
        this._printOne(this.imgJpegArr, 'jpg');
        this._printOne(this.imgPngArr, 'png');
        this._printOne(this.imgWebpArr, 'webp');
        this._printOne(this.xhrArr, 'xhr');
        this._printOne(this.reportArr, 'report');
        this._printOne(this.otherTypeArr, 'other');
        this._printOne(this.unkownArr, 'unknown');
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

    _isReportType(item) {
        return !!item.originalURL.match(/now\.qq\.com\/badjs\/|report\.url\.cn\//i);
    }

    _checkIfLoaded(item) {
        return !!item.originalURL.match(/table_id=personal_live_base/i);
    }
}

module.exports = HandleResponse;