(function () {
  var params = {};
  if (document) {
    params.domain = document.domain || '';
    params.url = document.url || '';
    params.reffer = document.reffer || '';
    params.title = document.title || '';
  }
  if (window) {
    params.sw = window.screen.width || '';
    params.sh = window.screen.height || '';
    params.cd = window.screen.colorDepth || '';
    window.performance = window.performance || '';
    //计算页面加载时间 performance.timing
    params.dnstim = domainLookupEnd - domainLookupStart;// DNS查询耗时
    params.tcptim = connectEnd - connectStart;// TCP链接耗时
    params.reqtim = responseEnd - responseStart;// request请求耗时
    params.domtim = domComplete - domInteractive;// 解析dom树耗时
    params.winwhite = domloadng - fetchStart; // 白屏时间
    params.readytim = domContentLoadedEventEnd - fetchStart;// domready时间
    params.loadtim = loadEventEnd - fetchStart;// onload时间 
  }
  if (navigator) {
    params.lang = navigator.language;
    params.av = navigator.appVersion;
  }
  if (_maq) {
    for (var i in _maq) {
      switch (_maq[i][0]) {
        case '_setAccount':
          params.account = _maq[i][1];
          break;
        default:
          break;
      }
    }
  }
  var args = '';
  Object.keys(params).map((key) => {
    if (args != '') {
      args += '&';
    }
    args += key + '=' + encodeURIComponent(params[key]);
  })
  var img = new Image();
  img.src = '/1.gif?' + args;
})();
