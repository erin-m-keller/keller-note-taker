const currentTitle = document.getElementById("title"),
      message = document.getElementById("note-content"),
      noteContent = document.getElementById("note-content");
let inputValue = ""; 

fetch('/save-note', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ currentTitle, message })
})
.then(response => response.text())
.then(data => console.log(data))
.catch(err => console.log(err));

function checkInputs () {
    if (currentTitle.value && noteContent.value) {
        document.getElementById("save-btn").style.display = "block";
    }
}

currentTitle.addEventListener("input", checkInputs);
noteContent.addEventListener("input", checkInputs);
currentTitle.addEventListener("input", (event) => {
    const noteTitleElem = document.getElementById("note-title");
    inputValue = event.target.value;
    noteTitleElem.textContent = inputValue;
});