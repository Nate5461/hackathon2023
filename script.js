document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    let logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }
}

// Get the text area and speak button elements
let textArea = document.getElementById("note");


// Add an event listener to the speak button
function textToSpeech() {
  // Get the text from the text area
  let text = textArea.value;

  // Create a new SpeechSynthesisUtterance object
  let utterance = new SpeechSynthesisUtterance(text);


  // Speak the utterance
  window.speechSynthesis.speak(utterance);
}



function addFile() {
    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    newFileButton.textContent = 'My New File';
    newFileButton.addEventListener('click', () => console.log("Go to new note"));
    filebar.appendChild(newFileButton);
}

function checkPage() {
    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'notes.html';
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'login.html';
}