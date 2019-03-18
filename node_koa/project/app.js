const Koa = require("koa");
const app = new Koa();
const myrouter = require('./lib/router');
const mongoose = require('mongoose');
const router = require("koa-router")();

//设置mongoo DB配置
const mongoo = require('./constant/mongodb').mongoURI;
mongoose.connect(mongoo)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log('mongodb unconnected:' + err));

//const ejs = require('ejs');
//设置中间件
app.use(myrouter.routes());

app.listen(3000);
console.log("listen on 3000");