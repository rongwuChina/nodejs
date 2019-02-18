const express = require('express');
const path = require('path');
const writelog = require('./controllers/writelog');
const app = express();
let cookieid = '';

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, 'view/index.html'));
});

app.get('/webanalysis.js', (req, res) => {
  //设置返回格式
  res.setHeader('Content-Type', 'application/x-javascript');
  res.sendFile(path.join(__dirname, 'webanalysis.js'));
});

app.get('/1.gif', (req, res) => {
  writelog(req, res);
  //设置cookie
  //设置返回格式
  res.setHeader('content-type', 'image/gif');
  //设置不缓存
  res.setHeader("Expires", -1);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.sendFile(path.join(__dirname, '1.gif'));
});

app.listen(3000, () => {
  console.log('1233');
});
