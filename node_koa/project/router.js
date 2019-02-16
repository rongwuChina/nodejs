const xlsx = require('node-xlsx');
const fs = require("fs");
const csv = require('csv');
const path = require('path');
const conf = require('./constant/config');
const nodeExcel = require('excel-export');

//导入excel文件
async function upload(ctx) {
    const file = ctx.request.files; // 上传的文件在ctx.request.files.file
    let len = Object.keys(file).length;
    for (let i = 0; i < len; i++) {
        const item = file[Object.keys(file)[i]];
        const extention = item.name.substr(item.name.indexOf('.'));
        if (extention === '.xlsx') {
            ctx.body = await xlsxfunc(item, ctx);
            //返回保存的路径
            return
        }
        else if (extention === '.csv') {
            //返回保存的路径
            ctx.body = await csvfuc(item, ctx);
            return
        }
        else {
            //返回保存的路径
            return ctx.body = { RTNCOD: 'ERR0000', MSG: '请上传.csv或.xlsx格式的文件！' };
        }
    }
}
async function xlsxfunc(xlsxfile, ctx) {
    async function analysisdata() {
        return new Promise((resolve, reject) => {
            //解析xlsx
            let obj = xlsx.parse(xlsxfile.path);
            resolve(obj);
        });
    }
    async function readdata(v) {
        //console.log("要上传的数据 = ", v[0].data);//要上传的数据 =  [ [ '姓名', '年龄' ], [ '张三', 20 ], [ '李四', 30 ] ]
        const data = {
            name: xlsxfile.name,
            data: v[0].data
        };
        return data;
    }
    let r = await analysisdata();
    r = await readdata(r);
    r = await caculate(r);
    return r;
}

async function csvfuc(csvfile, ctx) {
    async function analysisdata() {
        return new Promise((resolve, reject) => {
            //解析csv
            let output = new Array();//创建数组
            let parser = csv.parse({ delimiter: ',' });//调用csv模块的parse方法
            let input = fs.createReadStream(csvfile);//调用fs模块的createReadStream方法
            input.on("data", function (data) {
                parser.write(dict.gbkToUTF8(data));
            });
            input.on("close", function () {
                parser.end();
            });//读取操作的缓存装不下，只能分成几次发送，每次发送会触发一个data事件，发送结束会触发end事件
            parser.on('readable', function () {
                while (record = parser.read()) {
                    output.push(record);
                }
            });
            parser.on('finish', function () {
                resolve(output);
                //output是整个数据的数组
            })
        });
    }
    async function readdata(v) {
        //处理数据
        //console.log("csv =", v);//csv = [ [ '姓名', '年龄' ], [ '张三', '20' ], [ '李四', '30' ] ]
        const data = {
            name: xlsxfile.name,
            data: v
        };
        return data;
    }
    let r = await analysisdata();
    r = await readdata(r);
    r = await caculate(r);
    return r;
}
//做排序等操作---------23
async function caculate(v) {
    let conf = {};
    conf.name = v.name;//表格名
    conf.cols = [];
    //决定列表头和类型
    v.data[0].forEach((item, index) => {
        conf.cols.push({
            caption: item
        });
    })
    v.data.splice(0, 1);
    conf.rows = v.data; //[[td,td,td,td],[],[]]
    let result = nodeExcel.execute(conf);
    //最后3行express框架是这样写
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // res.setHeader("Content-Disposition", "attachment; filename=" + `${conf.name}.xlsx`);
    // res.end(result, 'binary');
    let data = Buffer.alloc(10 * 10, result, 'binary');
    var rtn = await write(conf, data);
    return rtn;
}
function write(conf, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'upload/') + conf.name, data, (err) => {
            if (err) {
                reject({ RTNCOD: 'ERR0000', MSG: '上传失败，请重新上传！' });
            } else {
                resolve({ RTNCOD: 'SUC0000' });
            }
        });
    })
}

//导出制定文件夹中的文件
async function exportexcel(ctx) {
    //导出
    const files = getallfiles(path.join(__dirname, 'upload'));
    data = fs.readFileSync(path.join(__dirname, 'upload/') + files[0]);
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set("Content-Disposition", "attachment; filename=" + `${conf.name}.xlsx`);
    ctx.body = data;

}

//获取指定文件夹中的文件
function getallfiles(path) {
    let components = []
    const files = fs.readdirSync(path);
    files.forEach(function (item, index) {
        let stat = fs.lstatSync(path + '/' + item);
        if (!stat.isDirectory()) {
            components.push(item)
        }
    });
    return components;
}

module.exports = {
    '/upload': upload,
    '/exportexcel': exportexcel
}