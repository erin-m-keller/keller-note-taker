// initialize variables
const express = require('express'),
      router = express.Router(),
      fs = require("fs");

/**
 * @jsonParse
 * express middleware function that parses
 * incoming requests with JSON payloads
 */
router.use(express.json());

/**
 * @saveNote
 * API call that accepts text parameters
 * from the parsed request body, then
 * saves to the db.json file
 */
router.post('/save-note', (req, res) => {
    // initialize variables
    const { title, msg } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        let existingData = JSON.parse(data),
            newData = { title, msg },
            updatedData;
        // push the new note to the existing list of notes in db.json
        existingData.push(newData);
        // stringify the data
        updatedData = JSON.stringify(existingData);  
        // if error, return message to the client side
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        // write the updated data to db.json
        fs.writeFile('data/db.json', updatedData, (err) => {
            // if error, throw error
            if (err) throw err;
            // else return a success message
            res.status(200).json({success: 'Note successfully saved!'});
        });
    });
});

/**
 * @saveSelectedNote
 * API call that accepts text parameters
 * from the parsed request body, then
 * saves the currently selected note 
 * to the db.json file
 */
router.post('/save-selected-note', (req, res) => {
    // initialize variables
    const { noteIndex, title, msg } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        let existingData = JSON.parse(data),
            newData = { title, msg },
            updatedData;
        // set the new data to the currently selected note index
        existingData[noteIndex] = newData;
        // stringify the data
        updatedData = JSON.stringify(existingData);  
        // if error, return message to the client side
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        // write the updated data to db.json
        fs.writeFile('data/db.json', updatedData, (err) => {
            // if error, throw error
            if (err) throw err;
            // else return a success message
            res.status(200).json({success: 'Note successfully saved!'});
        });
    });
});

/**
 * @loadNotes
 * API call that reads the db.json file
 * and returns the JSON data to the
 * client side
 */
router.get('/load-notes', (req, res) => {
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // if error, return message to the client side
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        // else return the notes data to the client side
        res.json(JSON.parse(data));
    });
});

/**
 * @deleteNote
 * API call that accepts ID text parameter
 * from the parsed request body, then
 * deletes the currently selected note 
 * from the db.json file
 */
router.post('/delete-note', (req, res) => {
    // initialize variables
    const { noteIndex } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        const noteData = JSON.parse(data);
        // use the index to delete the specified note from the data
        noteData.splice(noteIndex, 1);
        // if error, return message to the client side
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        // else, write the updated notes data to db.json
        fs.writeFile('data/db.json', JSON.stringify(noteData), err => {
            // if error, return message to the client side
            if (err) return res.status(500).json({error: 'Error writing to db.json'});
            // else return a success message
            res.status(200).json({success: 'Note successfully deleted!'});
        });
    });
});

/**
 * @showNote
 * API call that accepts ID text parameter
 * from the parsed request body, then
 * returns the data for the currently
 * selected note
 */
router.post('/show-note', (req, res) => {
    // initialize variables
    const { noteIndex } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        const noteData = JSON.parse(data),
            selectedNote = noteData[noteIndex];
        // if error, return message to the client side
        if (err) return res.status(500).json({error: err});
        // if specified note is not found, return message to the client side
        if (!selectedNote) return res.status(404).json({error: 'Note not found.'});
        // else return the selected notes data
        res.json(selectedNote);
    });
});

/**
 * @export
 * object that holds the exported values 
 * and functions from this module
 */
module.exports = router;