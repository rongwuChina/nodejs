const Log = require('../models/log');

insertlog = (req) => {
    const logdata = {
        host: req.header.host,
        url: req.url,
        navigator: req.header['user-agent']
    }
    // const newLog = new Log(logdata);
    // newLog.save()
    //     .then((log) => console.log(log))
    //     .catch((err) => console.log('insert error:' + err));
    Log.insertMany(logdata)
        .then((log) => console.log('inset'+log))
        .catch((err) => console.log('insert error:' + err));
    Log.find({ url: '/' })
        .then((log) => console.log(log.length))
        .catch((err) => console.log('insert error:' + err))

}

module.exports = {
    insertlog: insertlog
}