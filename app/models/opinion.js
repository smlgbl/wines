/**
 * Created by samuel on 07.05.14.
 */
var assert = require('assert');

var op = {};
op.init = function(storage, callback) {
  storage = storage;
  assert(storage.save, 'Expected storage engine to have a save function');
  assert(storage.get, 'Expected storage engine to have a get function');
  assert(storage.update, 'Expected storage engine to have an update function');
  assert(storage.remove, 'Expected storage engine to have a remove function');

  op.add = function(data, cb) {
    storage.save(data, cb);
  };

  op.get = function(id, cb) {
    storage.get(id, cb);
  };

  op.edit = function(id, data, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
      } else {
        for(var a in data) {
          if(data.hasOwnProperty(a)) {
            res[a] = data[a];
          }
        }
        res.editAt = Date.now();
        storage.update(id, res, cb);
      }
    });
  };

  op.remove = function(id, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
      } else {
        storage.remove(id, cb);
      }
    });
  };

  op.flag = function(id, data, cb) {
    data.editedAt = Date.now();
    op.edit(id, {flag: data}, cb);
  };

  op.unflag = function(id, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
      } else {
        if(res.hasOwnProperty('flag')) {
          delete res.flag;
        }
        res.editAt = Date.now();
        storage.update(id, res, cb);
      }
    });
  };

  op.like = function(id, userId, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
      } else {
        if(!res.hasOwnProperty('likes')) {
          res.likes = [];
        }
        if(res.likes.some(function(like, index) {
          if(like.user === userId) {
            return true;
          } else return false;
        })) {
          cb(new Error("Already liked"));
          return;
        } else {
          cb(null, {
            id: id,
            likes: res.likes.push({user: userId, likedAt: Date.now()})
          });
        }
      }
    });
  };

  op.unlike = function(id, userId, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
        return;
      }
      if(!res.hasOwnProperty('likes')) {
          cb(new Error("No likes"));
          return;
      }
      if(res.likes.some(function(like, index) {
        if(like.user === userId) {
          res.likes.splice(index, 1);
          return true;
        } else return false;
      })) {
        cb(null, {id: id, likes: res.likes.length});
        return;
      } else {
        cb(new Error("Never liked"));
      }
    });
  };

  op.getLikes = function(id, cb) {
    storage.get(id, function(err, res) {
      if(err) {
        cb(err);
      } else {
        if(!res.hasOwnProperty('likes')) {
          cb(null, {id: id, likes: 0});
        } else {
          cb(null, {
            id: id,
            likes: res.likes.length
          });
        }
      }
    });
  };

  callback(null);
};

module.exports = op;
