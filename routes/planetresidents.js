const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseUrl = 'http://swapi.co/api/';

/* GET planets listing. */
router.get('/', function(req, res, next) {
  var planetsObj = {};
  var url = `${baseUrl}planets/`;
  var planetPromises = [];

  getPlanets(url)
    .then(planets => {
      res.json(planets);
    })
    .catch(error => {
      console.error('ERROR', error);
      res.send(error);
    });
  
  function getPlanets(url) {
    return axios.get(url)
      .then(response => {
        var url = response.data.next;
        var planets = response.data.results;
        // Add all planets on the page to the full list of planet promises
        planetPromises.push(...planets.map(planet => {
          return getResidents(planet).then(residents => {
            planetsObj[planet.name] = residents;
          });
        }));
        if (url) {
          return getPlanets(url);
        } else {
          // Once we have all the pages of planets, wait for all the planets to have
          // resident data before returning
          return Promise.all(planetPromises).then(() => planetsObj);
        }
      });
  }

    function getResidents(planet) {
      var residentPromises = planet.residents.map(getName);
      return Promise.all(residentPromises);
    }

    function getName(url) {
      return axios.get(url).then(response => {
        return response.data.name;
      });
    }
});

module.exports = router;
