var express = require('express');
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var fs = require('fs');
var events = require('events');

const myevent = new events.EventEmitter();
var count = 0;
var sucnum = 0;
//使用事件监听是否异步文件下载完成
myevent.on('filecount', function (num, len, res) {
  count++;
  sucnum += num;
  if (count === len && sucnum === len) {
    count = 0;
    sucnum = 0;
    res.send(JSON.stringify({ RTNCOD: 'SUC0000' }));
  }
  else if (count === len && sucnum < len) {
    count = 0;
    sucnum = 0;
    res.send(JSON.stringify({ RTNCOD: 'ERR0000', MSG: '文件上传失败！' }));
  }
});

const app = express();
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/login', function (req, res) {
  res.send('这是登录页面');
});
app.get('/register', function (req, res) {
  res.send('这是注册页面');
});
app.get('/uploadfile', function (req, res) {
  res.sendFile(__dirname + '/upload.html');
});
app.post('/upload', function (req, res) {
  //使用formidable处理前端发送的表单请求
  var form = new formidable.IncomingForm();
  //临时文件的路径
  form.uploadDir = path.join(__dirname, 'upload');
  //设置文件最大的尺寸
  form.maxFieldSize = 1 * 1024 * 1024;
  //是否保留文件的原拓展名
  form.keepExtensions = true;
  form.parse(req, function (err, fields, file) {
    var data = util.inspect({ fields: fields, file: file });
    var filepath = '';
    var filename = '';
    const filesdata = Object.keys(file);
    fs.writeFile('./data/' + JSON.stringify(fields.name) + '.json', JSON.stringify(fields), function (err) {
      console.log(err);
      if (err) {
        res.send(JSON.stringify({ RTNCOD: 'ERR0000', MSG: '文件上传失败！' }));
      } else {
        filesdata.map((key) => {
          fs.rename(file[key].path, path.join(__dirname, 'upload', file[key].name), function (err) {
            if (err) {
              myevent.emit('filecount', -1, filesdata.length, res);
            } else {
              myevent.emit('filecount', 1, filesdata.length, res); myevent.emit();
            }
          })
        });
      }
    });
  });
});
app.get('/user/:userid', function (req, res) {
  res.send(`用户${userid}主页面`);
});
//express托管静态资源文件  
//将resource屋里文件夹中的文件映射到/public中
app.use('/public', express.static('resource'));
app.listen(8888);
