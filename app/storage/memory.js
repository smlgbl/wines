/**
 * Created by samuel on 07.05.14.
 */

var mem = {};
var m = [];

mem.save = function(data, callback) {
  var id;
  var empty = m.indexOf(null);
  if(empty < 0) {
    id = m.push(data) - 1;
  } else {
    m[empty] = data;
    id = empty;
  }

  callback(null, {id: id});
};

mem.get = function(id, callback) {
  if(m.length > id && !!m[id]) {
    callback(null, m[id]);
  } else {
    callback(new Error("Not found"));
  }
};

mem.find = function(filter, callback) {
  callback(null, m.filter(function(mx) {
    for(var f in filter) {
      if(!mx.hasOwnProperty(f)) {
        return false;
      } else {
        if(!mx[f] || mx[f] !== filter[f]) {
          return false;
        }
      }
    }
    return true;
  }));
};

mem.update = function(id, data, callback) {
  mem.get(id, function(err) {
    if(err) {
      callback(err);
    } else {
      m[id] = data;
      callback(null, {id: id});
    }
  });
};

mem.remove = function(id, callback) {
  mem.get(id, function(err) {
    if(err) {
      callback(err);
    } else {
      m[id] = null;
      callback(null, null);
    }
  });
};

module.exports = mem;
