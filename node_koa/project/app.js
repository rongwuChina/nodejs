const Koa = require("koa");
const router = require("koa-router")();
const fs = require("fs");
const koaBody = require('koa-body');
const path = require('path');
const app = new Koa();
const myrouter = require('./router');
//const ejs = require('ejs');
//设置中间件
app.use(router.routes());

router.get("/", (ctx) => {
    ctx.body = fs.readFileSync(path.join(__dirname, "views/index.html"), "utf-8");
});
//导入Excel，xlsx格式
router.post('/upload', koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}), (ctx) =>myrouter['/upload'](ctx));
//导出Excel，xlsx格式
router.get('/exportexcel', (ctx) => myrouter['/exportexcel'](ctx));

app.listen(3000);
console.log("listen on 3000");