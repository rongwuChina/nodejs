
const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = function (req, res) {
    const params = url.parse(req.url, true);
    const time = new Date().getTime();
    if (req.headers && req.headers.cookie
        && req.headers.cookie.indexOf('analyscookie') > -1) {
        cookieid = req.headers.cookie.split('analyscookie')[1].split('=')[1];
    } else {
        cookieid = "analys" + time;
        res.setHeader("Set-Cookie", 'analyscookie=' + cookieid);
    }
    const data = Object.assign(params.query, { time: time, cookieid: cookieid });
    fs.writeFile(path.join(__dirname, '../log/', time + '.log'), JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('日志记录完成！');
        }
    });
}