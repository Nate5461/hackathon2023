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

    document.getElementById('speech-to-text-menu')?.addEventListener('click', speechToText);
}
if (window.location.href.endsWith('notes.html')) {
  fetch('/api/file/fileInfo')
      .then(response => response.json())
      .then(data => {
          const sidebar = document.getElementById('sidebarID');
          const textarea = document.getElementById('writingID');

          data.notes.forEach(note => {
              const noteElement = document.createElement('div');
              noteElement.textContent = note.title;

              noteElement.addEventListener('click', () => {
                  textarea.value = note.content;
              });

              sidebar.appendChild(noteElement);
          });
      })
      .catch(error => console.error('Error:', error));
}
// Get the text area and speak button elements
let textArea = document.querySelector('textarea[name="writing"]');

// Add an event listener to the speak button
function textToSpeech() {
    console.log("textToSpeech");

    // Get the text from the text area
    let text = textArea.value;

    console.log(text);
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

var recognition; // Global variable to maintain the speech recognition state
var recognizing = false; // Flag to track if recognition is happening

function speechToText(event) {
  event.preventDefault(); // Stop the anchor tag from following the href

  if (!recognition) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function() {
      console.log("Speech recognition started");
      recognizing = true;
      toggleStopButton(true); // Show the stop button when recognition starts
    };

    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function() {
      console.log("Speech recognition ended");
      recognizing = false;
      toggleStopButton(false); // Hide the stop button when recognition ends
    };

    recognition.onresult = function(event) {
      var textarea = document.querySelector('.writing');
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          textarea.value += event.results[i][0].transcript;
        }
      }
    };
  }

  // Toggle start and stop of recognition
  if (recognizing) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function toggleStopButton(show) {
  var stopButton = document.getElementById('stop-speech-btn');
  stopButton.style.display = show ? 'inline-block' : 'none'; // Show or hide the button
}

document.getElementById('stop-speech-btn').addEventListener('click', function() {
  if (recognition) {
    recognition.stop();
    recognition = null; // Clear the recognition instance
  }
  recognizing = false;
  toggleStopButton(false); // Hide the button
});
