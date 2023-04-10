// initialize variables
const express = require('express'),
      router = express.Router(),
      fs = require("fs"),
      { v4: uuidv4 } = require('uuid');

/**
 * @jsonParse
 * express middleware function that parses
 * incoming requests with JSON payloads
 */
router.use(express.json());

/**
 * @getNotes
 * API call that reads the db.json file
 * and returns the JSON data to the
 * client side
 */
router.get('/notes', (req, res) => {
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // if error, return message to the client side
        if (err) return res.status(500).json({error: 'Error reading db.json'});
        // else return the notes data to the client side
        res.json(JSON.parse(data));
    });
});

/**
 * @postNotes
 * API call that accepts text parameters
 * from the parsed request body, then
 * saves to the db.json file
 */
router.post('/notes', (req, res) => {
    // initialize variables
    const { title, msg } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        let existingData = JSON.parse(data),
            noteId = uuidv4(),
            newData = { id: noteId, title: title, message: msg },
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
 * @deleteNote
 * API call that accepts ID text parameter
 * from the parsed request body, then
 * deletes the currently selected note 
 * from the db.json file
 */
router.delete('/notes/:id', (req, res) => {
    // initialize variables
    const noteIndex = req.params.id;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        const noteData = JSON.parse(data),
              noteObj = noteData.findIndex(obj => obj.id === noteIndex);
        // if note not found with id
        if (noteObj === -1) {
            // return 404 not found
            res.status(404).send('Note not found.');
            return;
        }
        // use the index to delete the specified note from the data
        noteData.splice(noteObj, 1);
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
 * @saveSelectedNote
 * API call that accepts text parameters
 * from the parsed request body, then
 * saves the currently selected note 
 * to the db.json file
 */
router.post('/selected-note', (req, res) => {
    // initialize variables
    const { noteIndex, title, msg } = req.body;
    // read the db.json file
    fs.readFile('data/db.json', 'utf-8', (err, data) => {
        // initialize variables
        let existingData = JSON.parse(data),
            newData = { id: noteIndex, title: title, message: msg },
            objectToUpdate,
            updatedData;
        // find the selected note in the json file
        objectToUpdate = existingData.find(obj => obj.id === noteIndex);
        // set the new data object id, title and message to the selected note object
        objectToUpdate.id = newData.id;
        objectToUpdate.title = newData.title;
        objectToUpdate.message = newData.message;
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
            selectedNote = noteData.find(obj => obj.id === noteIndex);
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