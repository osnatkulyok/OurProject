/* This script file is used to validate the form fields */

// Function to validate name
function validateName(name) {
  // Check if name is not empty, does not contain numbers and is at least 2 characters long
  const regex = /^[A-Za-z]{2,}$/;
  return regex.test(name);
}

// Function to validate username
function validateUsername(username) {
  // Check if username is not empty, is at least 2 characters long and no more than 20 characters
  const regex = /^.{2,20}$/;
  return regex.test(username);
}

// Function to validate email
function validateEmail(email) {
  // Check if email is in correct format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

// Function to validate password
function validatePassword(password) {
  // Check if password is not empty and is at least 6 characters long
  const regex = /^.{6,}$/;
  return regex.test(password);
}

// Function to check if password and password verification match
function doPasswordsMatch(password, passwordVerification) {
  return password === passwordVerification;
}

// Function to check if terms of service are agreed
function isTermsOfServiceAgreed(checkbox) {
  return checkbox.checked;
}

// Function to validate the entire form
function validateForm() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('userName').value;
  const email = document.getElementById('mail').value;
  const password = document.getElementById('password').value;
  const passwordVerification = document.getElementById('confirmPassword').value;
  const termsOfService = document.getElementById('flexCheckChecked');

  if (!validateName(firstName)) {
    alert('שם פרטי לא יכול להכיל מספרים, והוא חייב להכיל לפחות שני תווים');
    return false;
  }

  if (!validateName(lastName)) {
    alert('שם משפחה לא יכול להכיל מספרים, והוא חייב להכיל לפחות שני תווים');
    return false;
  }

  if (!validateUsername(username)) {
    alert('שם משתמש חייב להכיל לפחות שני תווים');
    return false;
  }

  if (!validateEmail(email)) {
    alert('כתובת מייל לא תקינה');
    return false;
  }

  if (!validatePassword(password)) {
    alert('על הסיסמא להיות לפחות באורך 6 תווים');
    return false;
  }

  if (!doPasswordsMatch(password, passwordVerification)) {
    alert('הסיסמא לא תאומת');
    return false;
  }

  if (!isTermsOfServiceAgreed(termsOfService)) {
    alert('יש לאשר את תנאי השירות שלנו');
    return false;
  }

  return true;
}

// Attach the validateForm function to the form's submit event
window.onload = function () {
  document.querySelector('form').addEventListener('submit', function (event) {
    if (!validateForm()) {
      event.preventDefault();
    }
  });
};