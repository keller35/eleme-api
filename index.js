'use strict';
var moment = require('moment');
var rp = require("request-promise");
var crypto = require('crypto');

const CONFIG = {
    host: 'http://v2.openapi.ele.me'
};

function Eleme(consumer_key, consumer_secret, config) {
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.configuration = Object.assign(CONFIG, config);
}

Eleme.prototype.config = function(config) {
    this.configuration = Object.assign(this.configuration, config);
}

Eleme.prototype.sign = function(url, params) {
    params.timestamp = moment().unix();
    params.consumer_key = this.consumer_key;
    const rawString = [
        url,
        '?',
        Object.keys(params).sort().map(key => key + '=' + params[key]).join('&'),
        this.consumer_secret
    ].join('');
    params.sig = crypto
        .createHash('md5')
        .update(rawString, 'utf8')
        .digest('hex')
        .toLowerCase();
    return params;
}

Eleme.prototype.get = function(path, params) {
    let url = this.configuration.host + path;
    this.sign(url, params);
    return rp({
        uri: url,
        qs: params,
        json: true
    });
}

Eleme.prototype.post = function(path, params) {
    let url = this.configuration.host + path;
    this.sign(url, params);
    return rp({
        method: 'POST',
        uri: url,
        body: params,
        json: true
    });
}

module.exports = Eleme;