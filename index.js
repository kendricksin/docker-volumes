const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'views' directory
app.use(express.static('views'));

// Handle GET request to the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Handle POST request to submit feedback
app.post('/submit-feedback', (req, res) => {
    const email = req.body.email;
    const message = req.body.message;

    // Log the feedback to the console
    console.log(`Feedback received from ${email}: ${message}`);

    // Send a response back to the client
    res.send('Thank you for your feedback!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
