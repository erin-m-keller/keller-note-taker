const express = require('express'),
      router = express.Router(),
      fs = require("fs");

// middleware to parse request body
router.use(express.json());

router.post('/save-note', (req, res) => {
    const { title, msg } = req.body;
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        let existingData = JSON.parse(data),
            newData = { title, msg },
            updatedData;
        existingData.push(newData);
        updatedData = JSON.stringify(existingData);  
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        fs.writeFile('data/db.json', updatedData, (err) => {
            if (err) throw err;
            res.status(200).json({success: 'Note successfully saved!'});
        });
    });
});

router.post('/save-selected-note', (req, res) => {
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

router.get('/load-notes', (req, res) => {
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        res.json(JSON.parse(data));
    });
});

router.post('/delete-note', (req, res) => {
    const { noteIndex } = req.body;
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        const noteData = JSON.parse(data);
        noteData.splice(noteIndex, 1);
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        fs.writeFile('data/db.json', JSON.stringify(noteData), err => {
            if (err) return res.status(500).json({error: 'Error writing to db.json'});
            res.status(200).json({success: 'Note successfully deleted!'});
        });
    });
});

router.post('/show-note', (req, res) => {
    const { noteIndex } = req.body;
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        const noteData = JSON.parse(data),
            selectedNote = noteData[noteIndex];
        if (err) return res.status(500).json({error: err});
        if (!selectedNote) return res.status(404).json({error: 'Note not found.'});
        res.json(selectedNote);
    });
});

module.exports = router;