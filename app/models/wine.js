var allowedAttrs = require('./attributes.json');
var wine = {};
var storage = {};

function init(conf) {

};

function save(data, callback) {
  var objLen = 0;
  for(var a in data) {
    if(!allowedAttrs.hasOwnProperty(a) || typeof a !== allowedAttrs[a]) {
      callback(new Error("Invalid Attributes! (" + a + ")"));
      return;
    }
    objLen++;
  }

  if(!objLen) {
    callback(new Error("Empty data object. Nothing created."));
    return;
  }

  var newWine = {};
  for(var attr in allowedAttrs) {
    newWine[attr] = data[attr] || undefined;
  }
  storage.save(newWine, callback);
};

wine.save = save;
module.exports = wine;
