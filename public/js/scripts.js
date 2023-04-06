const currentTitle = document.getElementById("title"),
      noteContent = document.getElementById("note-content"),
      noteTitleElem = document.getElementById("note-title"),
      saveBtn = document.getElementById("save-btn"),
      saveBtnWrapper = document.getElementById("save-btn-wrapper"),
      notesTbl = document.getElementById("notes-tbl"),
      newNoteBtn = document.getElementById("new-note-btn");

function init () {
    loadNotes();
}

init();

function loadNotes () {
    fetch('/load-notes').then(response => response.json())
    .then(data => {
        notesTbl.innerHTML = "";
        if (data.length === 0) {
            let newRow = notesTbl.insertRow(),
                msgCell = newRow.insertCell();
            msgCell.colSpan = 3;
            msgCell.appendChild(document.createTextNode("Create a new note to see it saved here!"));
        } else {
            for (var [idx,note] of data.entries()) {
                let title = note.title,
                    index = idx + 1,
                    newRow = notesTbl.insertRow(),
                    idxCell = newRow.insertCell(),
                    titleCell = newRow.insertCell(),
                    deleteCell = newRow.insertCell(),
                    anchor = document.createElement('a'),
                    anchorIcon = document.createElement('i');
                titleCell.addEventListener("click", () => showNote(index)); 
                titleCell.className = "clickable-row";
                anchorIcon.className = "fa-regular fa-trash-can";
                anchor.href = "javascript:void(0)";
                anchor.addEventListener("click", () => deleteNote(index));
                anchor.appendChild(anchorIcon);
                idxCell.appendChild(document.createTextNode(index));
                titleCell.appendChild(document.createTextNode(title));
                deleteCell.appendChild(anchor);
            }
        }
    })
    .catch(error => console.error(error));
}

function saveNote () {
    let title = currentTitle.value,
        msg = noteContent.value,
        noteIndex = JSON.parse(localStorage.getItem("currentlyViewing"));
    if (noteIndex >= 0) {
        fetch('/save-selected-note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ noteIndex, title, msg })
        })
        .then(response => response.json())
        .then(data => {
            loadNotes();
            localStorage.removeItem("currentlyViewing");
            clearInputs();
        })
        .catch(error => console.error(error));
    } else {
        fetch("/save-note", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ title, msg })
        })
        .then(response => response.text())
        .then(data => {
            loadNotes();
            clearInputs();
        })
        .catch(err => console.log(err));
    }
}

function deleteNote (idx) {
    let noteIndex = idx - 1,
        noteIdxStorage = JSON.parse(localStorage.getItem("currentlyViewing"));
    fetch('/delete-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noteIndex })
    })
    .then(response => response.json())
    .then(data => {
        loadNotes();
        if (noteIndex === noteIdxStorage) clearInputs();
    })
    .catch(error => console.error(error));
}

function showNote (idx) {
    let noteIndex = idx - 1;
    fetch("/show-note", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteIndex })
    })
    .then(response => response.json())
    .then(data => {
        currentTitle.value = data.title;
        noteContent.value = data.msg;
        noteTitleElem.textContent = data.title;
        saveBtnWrapper.style.display = "inline-block";
        localStorage.setItem("currentlyViewing", noteIndex);
    })
    .catch(error => console.error(error));
}

function clearInputs () {
    currentTitle.value = "";
    noteContent.value = "";
    noteTitleElem.textContent = "";
    saveBtnWrapper.style.display = "none";
    currentTitle.focus();
    localStorage.removeItem("currentlyViewing");
}

function checkInputs () {
    if (currentTitle.value.length > 0 && noteContent.value.length > 0) {
        saveBtnWrapper.style.display = "inline-block";
    } else {
        saveBtnWrapper.style.display = "none";
    }
}

newNoteBtn.addEventListener("click", clearInputs);
saveBtn.addEventListener("click", saveNote);
currentTitle.addEventListener("input", checkInputs);
noteContent.addEventListener("input", checkInputs);
currentTitle.addEventListener("input", (event) => {
    let inputValue = event.target.value;
    noteTitleElem.textContent = inputValue;
});