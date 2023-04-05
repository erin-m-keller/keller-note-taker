const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// serve client side files to html pages
app.use(express.static(path.join(__dirname, '/public')));

// get index.html
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// get notes.html
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '/views/notes.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);