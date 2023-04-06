const currentTitle = document.getElementById("title"); 
const message = document.getElementById("note-content");

let inputValue = ""; 

currentTitle.addEventListener("input", (event) => {
    const noteTitleElem = document.getElementById("note-title");
    inputValue = event.target.value;
    noteTitleElem.textContent = inputValue;
});

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