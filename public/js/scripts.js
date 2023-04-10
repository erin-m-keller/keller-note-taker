// initialize variables
const currentTitle = document.getElementById("title"),
      noteContent = document.getElementById("note-content"),
      saveBtn = document.getElementById("save-btn"),
      saveBtnWrapper = document.getElementById("save-btn-wrapper"),
      notesTbl = document.getElementById("notes-tbl"),
      newNoteBtn = document.getElementById("new-note-btn"),
      confirmModal = document.getElementById("confirm-modal"),
      modalContent = document.getElementById("modal-content");

/**
 * @init
 * Runs on page load
 */
function init () {
    // call @loadNotes function
    loadNotes();
}

/**
 * @loadNotes
 * makes a request to the load-notes api route
 * and appends the returned data to the page
 */
function loadNotes () {
    // fetch the route
    fetch("/api/load-notes").then(response => response.json())
    .then(data => {
        // clear the table of previous elements
        notesTbl.innerHTML = "";
        // if data is empty, append a string to the page
        if (data.length === 0) {
            // initialize variables
            let newRow = notesTbl.insertRow(),
                msgCell = newRow.insertCell();
            // set table cell column span to 3
            msgCell.colSpan = 3;
            // append the text to the cell
            msgCell.appendChild(document.createTextNode("Create a new note to see it saved here!"));
        } 
        // else, loop thrugh the data and append 
        // rows to the table with the avaiable data
        else {
            // loop through the data
            for (var [idx,note] of data.entries()) {
                // initialize variables
                let title = note.title,
                    noteId = note.id,
                    index = idx + 1,
                    newRow = notesTbl.insertRow(),
                    idxCell = newRow.insertCell(),
                    titleCell = newRow.insertCell(),
                    deleteCell = newRow.insertCell(),
                    anchor = document.createElement('a'),
                    anchorIcon = document.createElement('i');
                // create the table cell
                titleCell.addEventListener("click", () => showNote(noteId)); 
                titleCell.className = "clickable-row";
                titleCell.setAttribute("id","note-id-" + noteId);
                // create the anchor element
                anchorIcon.className = "fa-regular fa-trash-can";
                anchor.href = "javascript:void(0)";
                anchor.addEventListener("click", () => showConfirmModal(noteId));
                anchor.appendChild(anchorIcon);
                // append the note index to the cell
                idxCell.appendChild(document.createTextNode(index));
                // append the title to the cell
                titleCell.appendChild(document.createTextNode(title));
                // append the anchor link trash icon to the cell
                deleteCell.appendChild(anchor);
            }
        }
    })
    // log error if an error exists
    .catch(error => console.error(error));
}

/**
 * @saveNote
 * Has two API calls available, one to save 
 * currently selected note, and the other to 
 * save a new note
 */
function saveNote () {
    // initialize variables
    let title = currentTitle.value,
        msg = noteContent.value,
        noteIndex = JSON.parse(localStorage.getItem("currentlyViewing"));
    // if note index is not null
    if (noteIndex != null) {
        // call the route and pass in the note index, title and message to update
        fetch("/api/save-selected-note", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ noteIndex, title, msg })
        })
        // parses json data into a javascript object
        .then(response => response.json())
        .then(data => {
            // call @loadNotes function
            loadNotes();
            // remove currently viewing from local storage
            localStorage.removeItem("currentlyViewing");
            // call @clearInputs function
            clearInputs();
        })
        // log error if an error exists
        .catch(error => console.error(error));
    } 
    // else, no index means this is a new note
    else {
        // call the route and pass in the note title and message to update
        fetch("/api/save-note", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ title, msg })
        })
        // parses json data into a javascript object
        .then(response => response.text())
        .then(data => {
            // call @loadNotes function
            loadNotes();
            // call @clearInputs function
            clearInputs();
        })
        // log error if an error exists
        .catch(err => console.log(err));
    }
}

/**
 * @deleteNote
 * Posts the selected note index to the
 * delete-note api route to delete
 * the note
 */
function deleteNote (idx) {
    // initialize variables
    let noteIndex = idx,
        noteIdxStorage = JSON.parse(localStorage.getItem("currentlyViewing"));
    // call the route and pass in the note index to delete the selected note
    fetch("/api/delete-note", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ noteIndex })
    })
    // parses json data into a javascript object
    .then(response => response.json())
    .then(data => {
        // call @loadNotes function
        loadNotes();
        // close the confirm modal
        confirmModal.classList.remove("is-active");
        // if the note index matches the index in local storage,
        // call the @clearInputs function
        if (noteIndex === noteIdxStorage) clearInputs();
    })
    // log error if an error exists
    .catch(error => console.error(error));
}

/**
 * @showNote
 * Posts the selected note index to the
 * show-note api route to show the selected
 * note
 */
function showNote (idx) {
    // initialize variables
    let noteIndex = idx,
        noteElem = document.getElementById("note-id-" + idx),
        allNoteElems = document.getElementsByClassName("clickable-row");
    // loop through all note element rows
    for (let i = 0; i < allNoteElems.length; i++) {
        // remove the active class from the row
        allNoteElems[i].classList.remove("note-active");
    }
    // add the active class to the selected note
    noteElem.classList.add("note-active");
    // call the route and pass in the note index to show the selected note
    fetch("/api/show-note", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteIndex })
    })
    // parses json data into a javascript object
    .then(response => response.json())
    .then(data => {
        // set the title
        currentTitle.value = data.title;
        // set the note message
        noteContent.value = data.message;
        // display the save button
        saveBtnWrapper.style.display = "inline-block";
        // set currentlyViewing in local storage
        localStorage.setItem("currentlyViewing",JSON.stringify(noteIndex));
    })
    // log error if an error exists
    .catch(error => console.error(error));
}

/**
 * @clearInputs
 * Clear the inputs on the page,
 * hide the save button, and 
 * remove currentlyViewing from
 * local storage
 */
function clearInputs () {
    // initialize variables
    let allNoteElems = document.getElementsByClassName("clickable-row");
    // loop through all note element rows
    for (let i = 0; i < allNoteElems.length; i++) {
        // remove the active class from the row
        allNoteElems[i].classList.remove("note-active");
    }
    // clear the title
    currentTitle.value = "";
    // clear the message
    noteContent.value = "";
    // hide the save button
    saveBtnWrapper.style.display = "none";
    // set focus to the title input
    currentTitle.focus();
    // empty local storage
    localStorage.removeItem("currentlyViewing");
}

/**
 * @checkInputs
 * Displays the save button when
 * both the title and message have
 * data entered
 */
function checkInputs () {
    // if title and message length is greater than 0
    if (currentTitle.value.length > 0 && noteContent.value.length > 0) {
        // display the save button
        saveBtnWrapper.style.display = "inline-block";
    } 
    // else, if one or more are empty
    else {
        // hide the save button
        saveBtnWrapper.style.display = "none";
    }
}

/**
 * @showConfirmModal
 * Displays the confirm modal when
 * a user clicks the delete button
 */
function showConfirmModal (idx) {
    // initialize variables
    let deleteBtn = document.createElement('button'),
        cancelBtn = document.createElement('button'),
        heading = document.createElement('h2');
    // clear previous elements from the modal
    modalContent.innerHTML = "";
    // create the heading
    heading.innerText = "Are you sure you want to delete this note?";
    // create the cancel button
    cancelBtn.innerText = "Cancel";
    cancelBtn.className = "pure-button button-error";
    cancelBtn.addEventListener("click", () => closeConfirmModal());
    // create the delete/submit button
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "pure-button button-warning";
    deleteBtn.addEventListener("click", () => deleteNote(idx));
    // append the heading
    modalContent.appendChild(heading);
    // append the cancel button
    modalContent.appendChild(cancelBtn);
    // append the delete button
    modalContent.appendChild(deleteBtn);
    // show the confirm modal
    confirmModal.classList.add("is-active");
}

/**
 * @closeConfirmModal
 * Closes the confirm modal
 */
function closeConfirmModal () {
    // remove active class from confirm modal to close
    confirmModal.classList.remove("is-active");
}

// event listeners
newNoteBtn.addEventListener("click", clearInputs);
saveBtn.addEventListener("click", saveNote);
currentTitle.addEventListener("input", checkInputs);
noteContent.addEventListener("input", checkInputs);

// runs on page load
init();