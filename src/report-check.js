const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('./lib/util');

const REPORT_STR = 'https://report.url.cn/cgi-bin/tdbank?table_id=personal_live_base&busi_id=b_sng_im_personal_live&fields=%5B%22uin%22%2C%22uin_type%22%2C%22opername%22%2C%22module%22%2C%22source%22%2C%22networktype%22%2C%22platform%22%2C%22osVersion%22%2C%22terminalType%22%2C%22clientVersion%22%2C%22res3%22%2C%22action%22%5D&datas=%5B%5B%22%22%2C3%2C%22now_index%22%2C%22pc%22%2C%22%22%2C-3%2C%22pc%22%2C%22%22%2C%22%22%2C%22%22%2C%22%22%2C%22view%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.5328944835902658';

var params = util.getUrlQuery(REPORT_STR);

var checkMap = ivReportChecker.tdbank.getCheckNowH5Result(params);

// console.log(checkMap);
console.log(JSON.stringify(checkMap));
ivReportChecker.tdbank.printInTerminal(checkMap);