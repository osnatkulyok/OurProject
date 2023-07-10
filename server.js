// const express = require('express'); // Import Express.js
// const fs = require('fs'); // Import Node.js file system module
// const csvtojson = require('csvtojson'); // Import module for converting CSV to JSON
// const app = express();

// app.use(express.json()); // Enable Express to parse JSON payloads
// app.use(express.static('public')); // Serve static files from the 'public' directory

// // Endpoint for handling POST requests to "/submit"
// app.post('/submit', (req, res) => {
//   const formData = req.body; // Get form data from request body

//   // Format form data as a CSV row
//   const csvData = `${formData.name},${formData.userName},${formData.mail},${formData.password}\n`;


//   // Read the contents of the existing file
//   fs.readFile('data.csv', 'utf8', (readErr, contents) => {
//     if (readErr) {
//       console.error('Error reading file:', readErr); // Log error
//       res.sendStatus(500); // Respond with HTTP status 500 (Internal Server Error)
//       return;
//     }

//     // Convert CSV contents to JSON
//     csvtojson()
//       .fromString(contents)
//       .then(users => {
//         // Check if email already exists
//         const emailExists = users.some(user => user.Email === formData.mail);

//         if (emailExists) {
//           // If email exists, respond with HTTP status 400 (Bad Request)
//           res.status(400).send('Email already registered');
//           return;
//         }

//         // If email doesn't exist, append the new user data
//         fs.appendFile('data.csv', csvData, { flag: 'a+' }, appendErr => {
//           if (appendErr) {
//             console.error('Error writing to file:', appendErr); // Log error
//             res.sendStatus(500); // Respond with HTTP status 500
//           } else {
//             console.log('Form data written to file successfully!');
//             res.sendStatus(200); // Respond with HTTP status 200 (OK)
//           }
//         });
//       })
//       .catch(error => {
//         console.error('Error converting CSV to JSON:', error); // Log error
//         res.sendStatus(500); // Respond with HTTP status 500
//       });
//   });
// });

// // Endpoint for handling GET requests to "/fileContents"
// app.get('/fileContents', (req, res) => {
//   fs.readFile('data.csv', 'utf8', (err, contents) => {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         // If the file doesn't exist, create it with a header row
//         fs.writeFile('data.csv', 'Name,Username,Email,Password\n', err => {
//           if (err) {
//             console.error('Error creating file:', err); // Log error
//             res.sendStatus(500); // Respond with HTTP status 500
//           } else {
//             console.log('File created successfully!');
//             res.send([]); // Respond with an empty array
//           }
//         });
//       } else {
//         console.error('Error reading file:', err); // Log error
//         res.sendStatus(500); // Respond with HTTP status 500
//       }
//     } else {
//       // Convert the CSV contents to JSON
//       csvtojson()
//         .fromString(contents)
//         .then(jsonObj => {
//           // Send the JSON data as the response
//           res.json(jsonObj);
//         })
//         .catch(error => {
//           console.error('Error converting CSV to JSON:', error); // Log error
//           res.sendStatus(500); // Respond with HTTP status 500
//         });
//     }
//   });
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000'); // Log a message when the server starts successfully
// });

const express = require('express');
const fs = require('fs');
const csvtojson = require('csvtojson');
const app = express();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  const formData = req.body;

  // Sanitize input data by replacing any newline characters with a space
  const sanitizedFormData = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, String(value).replace(/\n/g, ' ')])
  );
  console.log("sanitizedFormData", sanitizedFormData);

  // Quote CSV fields to handle any data that includes commas
  const csvData = `"${sanitizedFormData.name}","${sanitizedFormData.userName}","${sanitizedFormData.mail}","${sanitizedFormData.password}"\n`;
  console.log("csvData", csvData);
  fs.readFile('data.csv', 'utf8', (readErr, contents) => {
    if (readErr) {
      console.error('Error reading file:', readErr);
      res.sendStatus(500);
      return;
    }

    csvtojson()
      .fromString(contents)
      .then(users => {
        const emailExists = users.some(user => user.Email === formData.mail);

        if (emailExists) {
          res.status(400).send('Email already registered');
          return;
        }

        fs.appendFile('data.csv', csvData, { flag: 'a+' }, appendErr => {
          if (appendErr) {
            console.error('Error writing to file:', appendErr);
            res.sendStatus(500);
          } else {
            console.log('Form data written to file successfully!');
            res.sendStatus(200);
          }
        });
      })
      .catch(error => {
        console.error('Error converting CSV to JSON:', error);
        res.sendStatus(500);
      });
  });
});

app.get('/fileContents', (req, res) => {
  fs.readFile('data.csv', 'utf8', (err, contents) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.writeFile('data.csv', 'Name,Username,Email,Password\n', err => {
          if (err) {
            console.error('Error creating file:', err);
            res.sendStatus(500);
          } else {
            console.log('File created successfully!');
            res.send([]);
          }
        });
      } else {
        console.error('Error reading file:', err);
        res.sendStatus(500);
      }
    } else {
      csvtojson()
        .fromString(contents)
        .then(jsonObj => {
          res.json(jsonObj);
        })
        .catch(error => {
          console.error('Error converting CSV to JSON:', error);
          res.sendStatus(500);
        });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});