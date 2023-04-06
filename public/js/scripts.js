const currentTitle = document.getElementById("title"); 
let inputValue = ""; 

currentTitle.addEventListener("input", (event) => {
    const noteTitleElem = document.getElementById("note-title");
    inputValue = event.target.value;
    noteTitleElem.textContent = inputValue;
});