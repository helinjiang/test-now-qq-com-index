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