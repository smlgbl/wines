var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var Wine = require('./app/models/wine.js');
var wines = [];

app.use(bodyParser());

var port = process.env.PORT || 8080;

var router = express.Router();

router.route('/wines')
  .post(
      function(req, res) {
        var wine = new Wine(req.body.name, req.body.price, req.body.pos, req.body.rating);
        res.json( { id: wines.push(wine) });
      }
      )
  .get(
      function(req, res) {
        res.json(wines);
      }
      );

router.route('/wines/:wine_id')
  .get(function(req, res) {
    var wineId = req.params.wine_id - 1;
    var wine = wines[wineId];
    if(wineId >= 0 && wine) {
      res.json(wine);
    }
    else {
      res.send(404);
    }
  })
  .put(function(req, res) {
    var wineId = req.params.wine_id - 1;
    var wine = wines[wineId];
    if(wineId >= 0 && wine) {
      for(var key in req.body) {
        if(wine.hasOwnProperty(key)) {
          wine[key] = req.body[key];
        }
      }
      res.json({id: wines.indexOf(wine) + 1});
    } else {
      res.send(404);
    }
  })
  .delete(function(req, res) {
    var wineId = req.params.wine_id - 1;
    var wine = wines[wineId];
    if(wineId >= 0 && wine) {
      wines.splice(wineId, 1);
      res.json({id: wineId + 1});
    } else {
      res.send(404);
    }
  });

router.get('/', function(req, res) {
  res.json({ message: "Welcome to the Wines-section." });
});

app.use('/api', router );

module.exports = function() {
  app.listen(port);
  console.log("Listening on Port %d", port);
};
