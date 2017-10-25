class ResponseItem {
    constructor(event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers, resourceType) {
        this.event = event;
        this.status = status;
        this.newURL = newURL;
        this.originalURL = originalURL;
        this.httpResponseCode = httpResponseCode;
        this.requestMethod = requestMethod;
        this.referrer = referrer;
        this.headers = headers;
        this.resourceType = resourceType;

        this.init();
    }

    init() {
        this.contentType = this.headers['content-type'] && this.headers['content-type'][0] || '';
        this.contentLength = parseInt(this.headers['content-length'] || 0);
    }

    toString() {
        console.log(this.originalURL, this.contentLength, (this.contentLength / 1024).toFixed(2) + 'kb');
    }
}

module.exports = ResponseItem;