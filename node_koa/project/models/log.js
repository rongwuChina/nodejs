const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    host: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    navigator: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = Log = mongoose.model('Log', logSchema);