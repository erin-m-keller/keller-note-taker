const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      app = express(),
      port = process.env.PORT || 3000;

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
  const { title, msg } = req.body;
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    let existingData = JSON.parse(data),
        newData = { title, msg },
        updatedData;
    existingData.push(newData);
    updatedData = JSON.stringify(existingData, null, 2);  
    if (err) {
      return res.status(500).send(JSON.stringify('Error reading db.json'));
    }
    fs.writeFile('data/db.json', updatedData, (err) => {
      if (err) throw err;
      res.status(200).send(JSON.stringify('Note successfully saved!'));
    });
  });
});

app.get('/load-notes', (req, res) => {
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send(JSON.stringify('Error reading db.json'));
    }
    res.json(JSON.parse(data));
  });
});

app.post('/delete-note', (req, res) => {
  const { noteIndex } = req.body;
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    const jsonData = JSON.parse(data);
    jsonData.splice(noteIndex, 1);
    if (err) {
      return res.status(500).send('Error reading db.json');
    }
    fs.writeFile('data/db.json', JSON.stringify(jsonData), err => {
      if (err) {
        return res.status(500).send(JSON.stringify('Error writing to db.json'));
      }
      res.status(200).send(JSON.stringify('Note successfully deleted!'));
    });
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);