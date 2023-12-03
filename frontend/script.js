document.addEventListener("DOMContentLoaded", checkPage);


document.addEventListener("DOMContentLoaded", function() {
  if (window.location.href.endsWith('notes.html')) {
      fetch('/api/file/fileInfo')
          .then(response => response.json())
          .then(data => {
              const sidebar = document.getElementById('sidebarID');
              const textarea = document.getElementById('writingID');

              data.notes.forEach(note => {
                  const noteElement = document.createElement('div');
                  noteElement.textContent = note.title;
                  noteElement.classList.add('note');

                  noteElement.addEventListener('click', () => {
                      // remove the selected class from all notes
                      const notes = sidebar.querySelectorAll('.note');
                      notes.forEach(note => {
                          note.classList.remove('selected');
                      });

                      // add the selected class to the clicked note
                      noteElement.classList.add('selected');

                      textarea.value = note.content;
                  });

                  sidebar.appendChild(noteElement);
              });
          });
  }
});
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

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signinButton').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from being submitted normally

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid username or password');
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = 'notes.html'; // Redirect to 'notes.html'
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Invalid username or password. Please try again.'); // Show an error message
    });
  });
});



function addFile() {
    let filebar = document.querySelector('.files');
    let newFileButton = document.createElement('button');
    newFileButton.textContent = 'My New File';
    newFileButton.addEventListener('click', () => console.log("Go to new note"));
    filebar.appendChild(newFileButton);
}

function checkPage() {
  let token = localStorage.getItem('token');
  if (window.location.href.includes('login.html') && token)
      window.location = 'notes.html';
  if (window.location.href.includes('notes.html') && !token)
      window.location = 'login.html';
}

function logout(event) {
  event.preventDefault();
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}


var recognition; // Global variable to maintain the speech recognition state
var recognizing = false; // Flag to track if recognition is happening

document.getElementById('speech-to-text-menu').addEventListener('click', speechToText);

function speechToText(event) {
  console.log("speechToText");
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

 


document.addEventListener('DOMContentLoaded', function() {
  const filesDiv = document.getElementById('sidebarID').querySelector('.files');

  filesDiv.addEventListener('click', function(event) {
      const clickedElement = event.target;

      // check if the clicked element is a note
      if (clickedElement.classList.contains('note')) { // replace 'note' with the actual class of the notes
          // remove the selected class from all notes
          const notes = filesDiv.querySelectorAll('.note'); // replace 'note' with the actual class of the notes
          notes.forEach(note => {
              note.classList.remove('selected');
          });

          // add the selected class to the clicked note
          clickedElement.classList.add('selected');
      }
  });
});



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
