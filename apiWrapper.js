var must = require('must');
var request = require('supertest');

var contentType = 'application/json';
var acceptHeader = { Accept: contentType };

function defaultTest(err, res) {
  if(err) throw err;
  if(res.error) {
    if(res.body.errMessage) res.error.message += "\n\tServer says: " + res.body.errMessage;
    throw res.error;
  } else {
    res.type.must.equal(contentType);
  }
}
exports.IDRegEx = /^[A-Za-z0-9]+$/;

exports.testId = function(res) {
    res.body.result.must.match(exports.IDRegEx);
    return res.body.result;
};

exports.post = function(to, data, testFn, execDefaultTests) {
  request(to)
    .post('')
    .send(data)
    .set(acceptHeader)
    .end(function(err, res){
      if(execDefaultTests !== false ) defaultTest(err, res);
      testFn(res);
    });
};

exports.put = function(to, data, testFn, execDefaultTests) {
  request(to)
    .put('')
    .send(data)
    .set(acceptHeader)
    .end(function(err, res){
      if(execDefaultTests !== false ) defaultTest(err, res);
      testFn(res);
    });
};

exports.get = function(to, testFn, execDefaultTests) {
  request(to)
    .get('')
    .set(acceptHeader)
    .end(function(err, res){
      if(execDefaultTests !== false ) defaultTest(err, res);
      testFn(res);
    });
};

exports.del = function(to, testFn, execDefaultTests) {
  request(to)
    .del('')
    .set(acceptHeader)
    .end(function(err, res){
      if(execDefaultTests !== false ) defaultTest(err, res);
      testFn(res);
    });
};
