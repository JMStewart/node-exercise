const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseUrl = 'http://swapi.co/api/';

/* GET character listing by name. */
router.get('/:name', function(req, res, next) {
  const name = req.params.name;
  axios.get(`${baseUrl}people/?search=${name}`)
    .then(response => {
      var results = response.data.results;
      if (results.length) {
        res.render('character', {character: response.data.results[0]});
      } else {
        res.send(`No character found named "${name}"`);
      }
    }).catch(error => {
      console.error('ERROR', error);
      res.send(error);
    })
});

module.exports = router;
