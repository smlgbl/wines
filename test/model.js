/**
 * Created by samuel on 29.04.14.
 */
var expect = require('must');
var model = require('../app/models/wine');
var attrs = require('../app/models/attributes.json');

describe('Data model test suite', function() {

  it('Creating a new model with no data', function() {
    model.save({}, function(err) {
      err.message.must.equal("Empty data object. Nothing created.");
    });
  });

  var data = {
    name: "horst"
  };
  var savedId;

  it('Creating a new model with a name', function(done) {
    model.save(data, function(err, horst) {
      expect(err).to.be.null();
      expect(horst).to.not.be.null();
      // now all need to be initiated ???
      for(var attr in attrs) {
        if(horst.hasOwnProperty(attr)) {
          var val = attrs[attr];
          expect(typeof horst[attr]).to.equal(val);
//          expect(horst[attr]).to.be.an.instanceof(val);
        }
      };
      expect(horst).to.have.a.property("name", data.name);
      expect(horst).to.have.a.property("id");
      savedId = horst.id;
      done();
    });
  });

  it('Getting the created model again', function(done) {
    model.find(savedId, function(err, horst) {
      expect(err).to.be.null();
      expect(horst).to.not.be.null();
      expect(horst).to.have.a.property("name", data.name);
      expect(horst).to.have.a.property("id", savedId);
      done();
    });
  });

  var data_pic = {
    pic: "horst"
  };
  var savedId_pic;
  it('Creating a new model with a picture', function(done) {
    model.save(data_pic, function(err, horst) {
      expect(err).to.be.null();
      expect(horst).to.not.be.null();
      expect(horst).to.have.a.property("pic", data_pic.pic);
      expect(horst).to.have.a.property("id");
      savedId_pic = horst.id;
      expect(horst.id).to.not.equal(savedId);
      done();
    });
  });

  it('Getting the created model again', function(done) {
    model.find(savedId_pic, function(err, horst) {
      expect(err).to.be.null();
      expect(horst).to.not.be.null();
      expect(horst).to.have.a.property("name", data.name);
      expect(horst).to.have.a.property("id", savedId);
      done();
    });
  });

});
