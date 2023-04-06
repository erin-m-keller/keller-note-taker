const currentTitle = document.getElementById("title"),
      noteContent = document.getElementById("note-content"),
      noteTitleElem = document.getElementById("note-title"),
      saveBtn = document.getElementById("save-btn");

function saveNote () {
    let title = currentTitle.value,
        msg = noteContent.value;
    fetch('/save-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, msg })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    clearInputs();
}

function clearInputs () {
    currentTitle.value = "";
    noteContent.value = "";
    noteTitleElem.value = "";
}

function checkInputs () {
    let saveBtnWrapper = document.getElementById("save-btn-wrapper");
    if (currentTitle.value.length > 0 && noteContent.value.length > 0) {
        saveBtnWrapper.style.display = "inline-block";
    } else {
        saveBtnWrapper.style.display = "none";
    }
}

saveBtn.addEventListener("click", saveNote);
currentTitle.addEventListener("input", checkInputs);
noteContent.addEventListener("input", checkInputs);
currentTitle.addEventListener("input", (event) => {
    let inputValue = event.target.value;
    noteTitleElem.textContent = inputValue;
});