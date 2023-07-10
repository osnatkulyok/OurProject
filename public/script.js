// Event listener for when the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  // Get reference to the form in the HTML
  const loginForm = document.getElementById('form');

  // Event listener for when the form is submitted
  loginForm.addEventListener('submit', function (event) {
    // Prevent the default form submission behaviour
    event.preventDefault();

    // Get values from the form fields
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const userName = document.getElementById('userName').value;
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    // Combine the first and last names
    const name = lastName + " " + firstName;

    // Fetch the contents of the file from the server
    fetch('/fileContents')
      .then(response => response.json()) // Parse the JSON from the response
      .then(contents => {
        // Check if the email already exists in the file contents
        console.log(contents);
        const emailExists = contents.some(user => user.Email === mail);

        if (emailExists) {
          // If the email exists, alert the user and stop the function execution
          alert('This email is already registered. Please enter another email or log into your account.');
          return;
        }

        // Prepare the user details
        const Details = JSON.stringify({
          name: name,
          userName: userName,
          mail: mail,
          password: password
        });

        // Send the user details to the server
        fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: Details
        })
        .then(response => {
          if (response.ok) {
            // If the request was successful, reset the form
            loginForm.reset();
            console.log("משתמש נוסף בהצלחה");
            // Redirect to the login form page
            //window.location.href = 'login_form.html';
          } else {
            // If the request failed, log the error message
            console.error('Failed to send form data:', response.statusText);
          }
        })
        .catch(error => {
          // If an error occurred while sending the form data, log the error
          console.error('Error sending form data:', error);
        });

      })
      .catch(error => {
        // If an error occurred while fetching the file contents, log the error
        console.error('Error fetching file contents:', error);
      });
  });
});
