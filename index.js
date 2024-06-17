const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fastcsv = require('fast-csv');
const app = express();
const port = 3000;
const tempFile = path.join(os.tmpdir(), 'feedback.csv');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'views' directory
app.use(express.static('views'));

// Handle GET request to the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Handle GET request to the feedback page
app.get('/view-feedback', (req, res) => {
    let feedbackData = [];
    if (fs.existsSync(tempFile)) {
        fs.createReadStream(tempFile)
            .pipe(fastcsv.parse({ headers: true }))
            .on('data', (row) => feedbackData.push(row))
            .on('end', () => {
                res.send(generateFeedbackPage(feedbackData));
            });
    } else {
        res.send(generateFeedbackPage(feedbackData));
    }
});

// Handle POST request to submit feedback
app.post('/submit-feedback', (req, res) => {
    const email = req.body.email;
    const message = req.body.message;

    // Log the feedback to the console
    console.log(`Feedback received from ${email}: ${message}`);

    // Append the feedback to the temporary file
    const feedback = { email, message };
    const ws = fs.createWriteStream(tempFile, { flags: 'a' });
    fastcsv.write([feedback], { headers: !fs.existsSync(tempFile) }).pipe(ws);

    // Send a response back to the client
    res.send('Thank you for your feedback!');
});

// Function to generate feedback page HTML
function generateFeedbackPage(feedbackData) {
    let tableRows = feedbackData.map(row => `
        <tr>
            <td>${row.email}</td>
            <td>${row.message}</td>
        </tr>`).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feedback List</title>
        </head>
        <body>
            <h1>All Feedback</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <a href="/">Back to form</a>
        </body>
        </html>`;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
