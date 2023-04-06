const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

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

app.post('/save-note', (req, res) => {
  const { noteTitle, noteMsg } = req.body,
        data = {
          title: noteTitle,
          message: noteMsg
  };
  fs.writeFile('data/db.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('Data saved to file');
    res.send('Data saved to file');
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);