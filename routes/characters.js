const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseUrl = 'http://swapi.co/api/';

/* GET characters listing. */
router.get('/', function(req, res, next) {
  const CHARS_TO_GET = 50;
  const sort = req.query.sort;
  const characters = [];
  var url = `${baseUrl}people/`;
  getPeople(url)
    .then(sortPeople(sort))
    .then(people => {
      res.json(people);
    })
    .catch(error => {
      console.error('ERROR', error);
      res.send(error);
    });

    function getPeople(url) {
      return axios.get(url)
        .then(response => {
          var data = response.data;
          characters.push(...data.results);
          url = data.next;
          var needMorePeople = (characters.length < CHARS_TO_GET && url);
          if (needMorePeople) {
            return getPeople(url);
          } else {
            return characters.slice(0, CHARS_TO_GET); // If we fetched too much data, trim the excess
          }
        });
    }

    function sortPeople(sort) {
      return function (people) {
        const validSorts = ['name', 'height', 'mass'];
        const index = validSorts.indexOf(sort)
        // If not one of the valid sort methods, return the unsorted list
        if (index < 0) {
          return people;
        }
        return people.sort((p1, p2) => {
          var val1 = p1[sort];
          var val2 = p2[sort];
          // If sorting by name, use a string sort
          if (index === 0) {
            if (val1 > val2) {
              return 1;
            } else if(val1 < val2) {
              return -1;
            } else {
              return 0;
            }
          }
          // If sorting by height or mass, use a numerical sort
          val1 = +val1 || Infinity;
          val2 = +val2 || Infinity;
          return val1 - val2;
        });
      }
    }
});

module.exports = router;
