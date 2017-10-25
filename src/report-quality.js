const ivReportChecker = require('@tencent/iv-report-checker');
const util = require('./lib/util');

const REPORT_STR = 'https://report.url.cn/cgi-bin/tdbank?table_id=now_page_quality_statistics&busi_id=b_sng_im_personal_live&fields=%5B%22busi_name%22%2C%22uri%22%2C%22is_offline%22%2C%22action%22%5D&datas=%5B%5B%22NOW%E7%9B%B4%E6%92%AD-PC%E5%AE%98%E7%BD%91%22%2C%22https%3A%2F%2Fnow.qq.com%2Findex.html%22%2C%22false%22%2C%22init_start%22%5D%2C%5B%22NOW%E7%9B%B4%E6%92%AD-PC%E5%AE%98%E7%BD%91%22%2C%22https%3A%2F%2Fnow.qq.com%2Findex.html%22%2C%22false%22%2C%22css_load%22%5D%2C%5B%22NOW%E7%9B%B4%E6%92%AD-PC%E5%AE%98%E7%BD%91%22%2C%22https%3A%2F%2Fnow.qq.com%2Findex.html%22%2C%22false%22%2C%22js_load%22%5D%2C%5B%22NOW%E7%9B%B4%E6%92%AD-PC%E5%AE%98%E7%BD%91%22%2C%22https%3A%2F%2Fnow.qq.com%2Findex.html%22%2C%22false%22%2C%22js_init%22%5D%2C%5B%22NOW%E7%9B%B4%E6%92%AD-PC%E5%AE%98%E7%BD%91%22%2C%22https%3A%2F%2Fnow.qq.com%2Findex.html%22%2C%22false%22%2C%22render_succ%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.788086644707936';

var params = util.getUrlQuery(REPORT_STR);


var checkMap = ivReportChecker.tdbank.getCheckQualityResult(params);

// console.log(checkMap);
console.log(JSON.stringify(checkMap));
ivReportChecker.tdbank.printInTerminal(checkMap);