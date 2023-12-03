document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password1 = document.getElementById('password1').value;
    var password2 = document.getElementById('password2').value;
  
    if (password1 !== password2) {
      alert('Passwords do not match');
      return;
    }
  
    console.log('Submitting form');
  
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password1,
        }),
      })
      .then(response => {
        console.log('Register response', response);
        return response.json();
      })
      .then(data => {
        console.log('Register data', data);
        alert('Registration successful');
      
        // Auto sign-in
        return fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password1,
          }),
        });
      })
      .then(response => {
        console.log('Sign-in response', response);
        return response.json();
      })
      .then(data => {
        console.log('Sign-in data', data);
        console.log('Redirecting to /notes.html');
        window.location.href = '/notes.html';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });