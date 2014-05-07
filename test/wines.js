var expect = require('must');
var api = require('../apiWrapper');
var app = require('../server');
var _ = require('lodash');
var async = require('async');

var config = {
  url: "http://localhost:8080/api/wines/"
};

describe('Wine API', function() {

  var savedWine = 1;
  var myWine = {
    name: "Bordeaux",
    price: 149
  };

  before(function(done) {
    app();
    done();
  });

  it('Add a wine', function(done) {
    api.post(config.url, myWine, function(res) {
      expect(res.body).to.have.a.property("id", savedWine);
      done();
    });
  });

  it("Get the wine", function(done) {
    api.get(config.url + savedWine, function(res) {
      expect(res.body).to.eql(myWine);
      done();
    });
  });

  it('Get all wines', function(done) {
    api.get(config.url, function(res) {
      expect(res.body).to.be.an.instanceOf(Array);
      expect(res.body).to.have.a.property("length", 1);
      done();
    });
  });

  it('Change the wine', function(done) {
    myWine.name = "Borjeaulais";
    api.put(config.url + savedWine, myWine, function(res) {
      expect(res.body).to.have.a.property("id", savedWine);
      done();
    });
  });

  it("Verify the change", function(done) {
    api.get(config.url + savedWine, function(res) {
      expect(res.body).to.eql(myWine);
      done();
    });
  });

  it('Add an invalid attribute', function(done) {
    myWine.invAttr = "Borjeaulais";
    api.put(config.url + savedWine, myWine, function(res) {
      expect(res.body).to.have.a.property("id", savedWine);
      delete myWine.invAttr;
      done();
    });
  });

  it("Verify the invalid Attribute wasn't saved", function(done) {
    api.get(config.url + savedWine, function(res) {
      expect(res.body).to.eql(myWine);
      expect(res.body).to.not.have.a.property("invAttr");
      done();
    });
  });

  it("Delete the wine", function(done) {
    api.del(config.url + savedWine, function(res) {
      expect(res.body).to.have.a.property("id", savedWine);
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('Get all wines', function(done) {
    api.get(config.url, function(res) {
      expect(res.body).to.be.an.instanceOf(Array);
      expect(res.body).to.have.a.property("length", 0);
      done();
    });
  });

  it("Add a lot of wines", function(done) {
    var noOfWines = 10;
    var funcs = [];
    while(noOfWines > 0) {
      noOfWines--;
      (function(n) {
        funcs.push(function(cb) {
          var wine = _.cloneDeep(myWine);
          wine.name = wine.name + '_' + n;
          api.post(config.url, wine, function(res) {
            expect(res.body).to.have.a.property("id", 10 - n);
            cb();
          });
        });
      })(noOfWines);

    }
    async.parallel(funcs, done);
  });

  it('Get all wines', function(done) {
    api.get(config.url, function(res) {
      expect(res.body).to.be.an.instanceOf(Array);
      expect(res.body).to.have.a.property("length", 10);
      done();
    });
  });

  it("Get wines for user");
  it("Get wines liked by user");

});
