/**
 * Created by samuel on 07.05.14.
 */
var expect = require('must');
var opinions = require('../app/models/opinion');
var storage = require('../app/storage/memory');

describe("Opinions module", function() {
  before(function(done) {
    opinions.init(storage, done);
  });

  it("Get an opinion", function(done) {
    opinions.get(7, function(err) {
      expect(err).to.have.a.property('message', "Not found");
      done();
    });
  });

  var savedId;
  var op1 = {user: 1, wine: 1, text: "x"};
  it("Add an opinion", function(done) {
    opinions.add(op1, function(err, o) {
      expect(err).to.be.null();
      expect(o).to.not.be.null();
      expect(o).to.have.a.property('id');
      expect(typeof o.id).to.equal('number');
      savedId = o.id;
      done();
    });
  });

  it("Get the opinion back", function(done) {
    opinions.get(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('user', op1.user);
      expect(res).to.have.a.property('wine', op1.wine);
      expect(res).to.have.a.property('text', op1.text);
      done();
    });
  });

  it("Edit an opinion", function(done) {
    op1.text = 'y';
    opinions.edit(savedId, {text: op1.text}, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      done();
    });
  });

  it("Get the opinion back", function(done) {
    opinions.get(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('user', op1.user);
      expect(res).to.have.a.property('wine', op1.wine);
      expect(res).to.have.a.property('text', op1.text);
      done();
    });
  });

  op1.flag = {reason: 'text', user: 1};
  it("Flag an opinion", function(done) {
    opinions.flag(savedId, op1.flag, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      done();
    });
  });

  it("Get the opinion back", function(done) {
    opinions.get(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('user', op1.user);
      expect(res).to.have.a.property('wine', op1.wine);
      expect(res).to.have.a.property('text', op1.text);
      expect(res).to.have.a.property('flag');
      expect(res.flag).to.eql(op1.flag);
      done();
    });
  });

  it("Un-Flag an opinion", function(done) {
    opinions.unflag(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      done();
    });
  });

  it("Get the opinion back", function(done) {
    opinions.get(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('user', op1.user);
      expect(res).to.have.a.property('wine', op1.wine);
      expect(res).to.have.a.property('text', op1.text);
      expect(res).to.not.have.a.property('flag');
      done();
    });
  });

  it("Add a like to an opinion", function(done) {
    opinions.like(savedId, 1, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 1);
      done();
    });
  });

  it("Get number of likes from an opinion", function(done) {
    opinions.getLikes(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 1);
      done();
    });
  });

  it("Add another like to an opinion", function(done) {
    opinions.like(savedId, 2, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 2);
      done();
    });
  });

  it("Get number of likes from an opinion", function(done) {
    opinions.getLikes(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 2);
      done();
    });
  });

  it("Remove a like from an opinion", function(done) {
    opinions.unlike(savedId, 1, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 1);
      done();
    });
  });

  it("Remove a like from an opinion", function(done) {
    opinions.unlike(savedId, 2, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.not.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 0);
      done();
    });
  });

  it("Remove a like from an opinion - that was never liked", function(done) {
    opinions.unlike(savedId, 1, function(err) {
      expect(err).to.not.be.null();
      expect(err).to.have.a.property("message", "Never liked");
      done();
    });
  });

  it("Get number of likes from an opinion", function(done) {
    opinions.getLikes(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.have.a.property('id', savedId);
      expect(res).to.have.a.property('likes', 0);
      done();
    });
  });

  it("Get opinions for wine", function(done) {
    opinions.getForWine(1, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.be.an.instanceof(Array);
      expect(res).have.a.property('length', 1);
      done();
    });
  });

  it("Get opinions for non-existant wine", function(done) {
    opinions.getForWine(13, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.be.an.instanceof(Array);
      expect(res).have.a.property('length', 0);
      done();
    });
  });

  it("Get opinions for user", function(done) {
    opinions.getForUser(1, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.be.an.instanceof(Array);
      expect(res).have.a.property('length', 1);
      done();
    });
  });

  it("Get opinions for non-existant user", function(done) {
    opinions.getForUser(13, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.be.an.instanceof(Array);
      expect(res).have.a.property('length', 0);
      done();
    });
  });

  it("Remove an opinion", function(done) {
    opinions.remove(savedId, function(err, res) {
      expect(err).to.be.null();
      expect(res).to.be.null();
      done();
    });
  });

  it("Get an opinion", function(done) {
    opinions.get(savedId, function(err) {
      expect(err).to.have.a.property('message', "Not found");
      done();
    });
  });
});
