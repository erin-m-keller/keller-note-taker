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
  const { title, msg } = req.body;
  fs.readFile('data/db.json', 'utf-8', (err, data) => {
    let existingData = JSON.parse(data),
        newData = { title, msg },
        updatedData;
    existingData.push(newData);
    updatedData = JSON.stringify(existingData, null, 2);  
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data');
    }
    fs.writeFile('data/db.json', updatedData, (err) => {
      if (err) throw err;
      console.log('Data saved to file');
      res.send('Data saved to file');
    });
  });
});


app.listen(port);
console.log('Server started at http://localhost:' + port);