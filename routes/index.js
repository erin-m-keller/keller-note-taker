const express = require('express'),
      router = express.Router(),
      path = require('path');

// get index.html
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// get notes.html
router.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/notes.html'));
});

module.exports = router;