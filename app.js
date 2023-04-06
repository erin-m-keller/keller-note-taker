const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      app = express(),
      port = process.env.PORT || 3000,
      api = require("./api");

// router
app.use("/api",api);

// middleware to parse request body
app.use(express.json());

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