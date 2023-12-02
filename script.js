document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);
document.addEventListener("DOMContentLoaded", speechToText);

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

function speechToText() {
    var recognition;
    var recognizing = false;
    var startStopButton = document.getElementById('start-stop-btn');
    var statusDisplay = document.getElementById('recognition-status');

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function() {
            recognizing = true;
            startStopButton.textContent = 'Stop';
            statusDisplay.textContent = 'Status: Active';
        };

        recognition.onerror = function(event) {
            console.log('Recognition error: ' + event.error);
        };

        recognition.onend = function() {
            recognizing = false;
            startStopButton.textContent = 'Start';
            statusDisplay.textContent = 'Status: Inactive';
        };

        recognition.onresult = function(event) {
            var textarea = document.querySelector('.writing');
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    textarea.value += event.results[i][0].transcript;
                }
            }
        };
    } else {
        startStopButton.style.visibility = 'hidden';
        statusDisplay.textContent = 'Speech recognition not supported in this browser.';
    }

    startStopButton.addEventListener('click', function() {
        if (recognizing) {
            recognition.stop();
            return;
        }
        recognition.start();
    }, false);
};
