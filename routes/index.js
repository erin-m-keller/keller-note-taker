// initialize variables
const express = require('express'),
      router = express.Router(),
      path = require('path');

/**
 * @homepageRoute
 * respond with the index.html page when a 
 * GET request is made to the homepage route
 */
router.get('/', function(req, res) {
    // load index.html
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

/**
 * @notesRoute
 * respond with the notes.html page when a 
 * GET request is made to the notes route
 */
router.get('/notes', function(req, res) {
    // load notes.html
    res.sendFile(path.join(__dirname, '../views/notes.html'));
});

/**
 * @export
 * object that holds the exported values 
 * and functions from this module
 */
module.exports = router;