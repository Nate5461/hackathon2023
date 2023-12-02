document.addEventListener('DOMContentLoaded', function () {
    // Get the registration form element
    var registerForm = document.querySelector('.register_form');

    // Add submit event listener to the form
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form values
        var username = document.getElementById('username').value;
        var password1 = document.getElementById('password1').value;
        var password2 = document.getElementById('password2').value;

        // Validate passwords
        if (password1 !== password2) {
            alert('Passwords do not match');
            return;
        }

        // Create a JSON object with user data
        var userData = {
            username: username,
            password: password1
        };

        fetch('userData.json')
            .then(response => response.json())
            .then(existingData => {
                // Append the new user data to the existing data
                existingData.push(userData);

                // Convert the updated data to JSON string
                var updatedData = JSON.stringify(existingData, null, 2);

                // Create a Blob object to save the updated JSON data
                var blob = new Blob([updatedData], { type: 'application/json' });

                
                alert('User data added successfully!');
            })
            .catch(error => {
                console.error('Error fetching or updating user data:', error);
                alert('Error adding user data. Please try again.');
            });
    });
});