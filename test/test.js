'use strict';
var nock = require('nock');
var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var moment = require('moment');
var crypto = require('crypto');
var Eleme = require('../index');

chai.use(chaiAsPromised);

const HOST = 'http://v2.openapi.ele.me';
const YOUR_APP_ID = 'yourappid';
const YOUR_APP_SECRET = 'yourappsecret';

describe('Eleme', function() {

    describe('get resource from host', function() {
        it('should get expected response', function() {
            let path = '/orders/batch_get/';
            let response = {
                "code": 200,
                "data": {
                    "order_ids": [
                        "1263764585861444",
                        "12637645858619444",
                        "12637645858619033"
                    ]
                },
                "message": "ok",
                "request_id": "125bc4a55e3c4e9eaf3f1a111a3e7443"
            };
            nock(HOST + path)
                .log(console.log)
                .get('')
                .query(true)
                .reply(200, response);
            let ele = new Eleme(YOUR_APP_ID, YOUR_APP_SECRET);
            let params = {
                day: '2015-11-11',
                restaurant_id: '123',
                statuses: '0'
            };
            return ele.get(path, params).should.eventually.deep.equal(response);
        });
    });

    describe('post resource to realHost', function() {
        it('should get expected response', function() {
            let path = '/comment/123123/reply/';
            let params = {
                comment_id: '1',
                content: 'OK',
                replier_name: '张三'
            };
            let response = {
                "code": 200,
                "data": null,
                "message": "ok",
                "request_id": "115bc4a55e3c4e9eaf3f1a111a3e7271"
            };
            nock(HOST)
                .log(console.log)
                .post(path, params)
                .reply(200, response);
            let ele = new Eleme(YOUR_APP_ID, YOUR_APP_SECRET);
            return ele.post(path, params).should.eventually.deep.equal(response);
        });
    });

});