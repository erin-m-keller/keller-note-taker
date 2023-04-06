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
    if (err) return res.status(500).json({error: 'Error reading db.json'});
    fs.writeFile('data/db.json', updatedData, (err) => {
      if (err) throw err;
      res.status(200).json({success: 'Note successfully saved!'});
    });
  });
});

app.post('/save-selected-note', (req, res) => {
  const { noteIndex, title, msg } = req.body;
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    let existingData = JSON.parse(data),
        newData = { title, msg },
        updatedData;
    existingData[noteIndex] = newData;
    updatedData = JSON.stringify(existingData);  
    if (err) return res.status(500).json({error: 'Error reading db.json'});
    fs.writeFile('data/db.json', updatedData, (err) => {
      if (err) throw err;
      res.status(200).json({success: 'Note successfully saved!'});
    });
  });
});

app.get('/load-notes', (req, res) => {
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    if (err) return res.status(500).json({error: 'Error reading db.json'});
    res.json(JSON.parse(data));
  });
});

app.post('/delete-note', (req, res) => {
  const { noteIndex } = req.body;
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    const jsonData = JSON.parse(data);
    jsonData.splice(noteIndex, 1);
    if (err) return res.status(500).json({error: 'Error reading db.json'});
    fs.writeFile('data/db.json', JSON.stringify(jsonData), err => {
      if (err) return res.status(500).json({error: 'Error writing to db.json'});
      res.status(200).json({success: 'Note successfully deleted!'});
    });
  });
});

app.post('/show-note', (req, res) => {
  const { noteIndex } = req.body;
  console.log("noteIndex: " + noteIndex);
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    const jsonData = JSON.parse(data),
          selectedNote = jsonData[noteIndex];
    if (err) return res.status(500).json({error: 'Error reading db.json'});
    if (!selectedNote) return res.status(404).json({error: 'Note not found.'});
    res.json(selectedNote);
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);