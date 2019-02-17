const myrouter = require('./routerconfig');
const router = require("koa-router")();
const koaBody = require('koa-body');
const path = require('path');
const fs = require("fs");
const http = require('http');
const logcontrol = require('../controllers/logcontrol');

router.get("/", (ctx) => {
    const req = ctx.request;
    logcontrol.insertlog(req);
    //console.log(http.request('http://www.baidu.com'));
    //http.request  爬虫
    ctx.body = fs.readFileSync(path.join(__dirname, "../", "views/index.html"), "utf-8");
});
//导入Excel，xlsx格式
router.post('/upload', koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}), (ctx) => {
    const req = ctx.request;
    logcontrol.insertlog(req);
    myrouter['/upload'](ctx);
});
//导出Excel，xlsx格式
router.get('/exportexcel', (ctx) => {
    const req = ctx.request;
    logcontrol.insertlog(req);
    myrouter['/exportexcel'](ctx);
});

module.exports = router;