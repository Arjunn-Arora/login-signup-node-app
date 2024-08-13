const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const app = express();
const PORT = 3000;

const FILE_PATH = 'employeedetails.txt';
const DELIMITER = '|';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Function to validate the password
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Serve home page (index.html) as the default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve employee.html when the user clicks "View Employee Details"
app.get('/employee.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'employee.html'));
});

// Handle form submissions from employee.html
app.post('/submit', (req, res) => {
    const formData = req.body;
    const newLine = `${formData.name}${DELIMITER}${formData.email}${DELIMITER}${formData.department}${DELIMITER}${formData.salary}\n`;

    fs.appendFile(FILE_PATH, newLine, (err) => {
        if (err) {
            return res.status(500).send('Error writing data file');
        }
        res.send('<script>alert("Form data saved successfully"); window.location.href = "/employee.html";</script>');
    });
});

// Serve stored data as a table
app.get('/data', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading data file');
        }

        let lines = data.trim().split('\n');

        let responseHTML = '<html><body><h1>Stored Data</h1><table border="1"><tr><th>Name</th><th>Email</th><th>Department</th><th>Salary</th><th>Update</th><th>Delete</th></tr>';

        lines.forEach((line, index) => {
            const [name, email, department, salary] = line.split(DELIMITER);
            responseHTML += `<tr><td>${name}</td><td>${email}</td><td>${department}</td><td>${salary}</td>
                <td><a href="/update?id=${index}">Update</a></td>
                <td><a href="/delete?id=${index}">Delete</a></td></tr>`;
        });

        responseHTML += '</table><br><a href="/employee.html">Back to Form</a></body></html>';
        res.send(responseHTML);
    });
});

// Handle update form requests
app.get('/update', (req, res) => {
    const id = querystring.parse(req.url.split('?')[1]).id;

    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading data file');
        }

        let lines = data.trim().split('\n');
        const [name, email, department, salary] = lines[Number(id)].split(DELIMITER);

        let responseHTML = '<html><body><h1>Update Form</h1>';
        responseHTML += '<form action="/submit-update?id=' + id + '" method="POST">';
        responseHTML += `<label for="name">Name:</label><input type="text" id="name" name="name" value="${name}" required><br><br>`;
        responseHTML += `<label for="email">Email:</label><input type="email" id="email" name="email" value="${email}" required><br><br>`;
        responseHTML += `<label for="department">Department:</label><input type="text" id="department" name="department" value="${department}" required><br><br>`;
        responseHTML += `<label for="salary">Salary:</label><input type="number" id="salary" name="salary" value="${salary}" required><br><br>`;
        responseHTML += '<button type="submit">Update</button></form></body></html>';

        res.send(responseHTML);
    });
});

// Handle update submissions
app.post('/submit-update', (req, res) => {
    const id = querystring.parse(req.url.split('?')[1]).id;
    const formData = req.body;
    const newLine = `${formData.name}${DELIMITER}${formData.email}${DELIMITER}${formData.department}${formData.salary}`;

    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading data file');
        }

        let lines = data.trim().split('\n');
        lines[Number(id)] = newLine;

        fs.writeFile(FILE_PATH, lines.join('\n') + '\n', 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing data file');
            }
            res.send('<script>alert("Data updated successfully"); window.location.href = "/employee.html";</script>');
        });
    });
});

// Handle delete requests
app.get('/delete', (req, res) => {
    const id = querystring.parse(req.url.split('?')[1]).id;

    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading data file');
        }

        let lines = data.trim().split('\n');
        lines.splice(Number(id), 1);

        fs.writeFile(FILE_PATH, lines.join('\n') + '\n', 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error writing data file');
            }
            res.send('<script>alert("Data deleted successfully"); window.location.href = "/employee.html";</script>');
        });
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Validate the password
    if (!validatePassword(password)) {
        return res.send(`<script>
                            alert("Password must be at least 8 characters long and contain alphabets, numbers, and special characters.");
                            window.location.href = "register27.html";
                         </script>`);
    }

    // Path to your data.json file
    const filePath = path.join(__dirname, 'data.json');

    // Read existing users
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error reading file." });
        }

        let users = [];
        if (data.length > 0) {
            users = JSON.parse(data);
        }

        // Check if the email is already registered
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.send(`<script>
                                alert("Email already registered.");
                                window.location.href = "register27.html";
                             </script>`);
        }

        // Add the new user to the array
        users.push({ name, email, password: password.trim() }); // Store trimmed password

        // Write updated users to the file
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error writing file." });
            }
            res.send('<script>alert("Registration Successful!"); window.location.href = "login27.html";</script>');
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error reading file." });
        }

        let users = [];
        if (data.length > 0) {
            users = JSON.parse(data);
        }

        console.log('Users:', users);
        console.log('Login Data:', { email, password });

        const user = users.find(user => user.email === email && user.password === password.trim());

        if (user) {
            // Send the username to the client and redirect to home.html
            return res.send(`<script>
                                localStorage.setItem('username', '${user.name}');
                                alert("Login successful! Redirecting to homepage.");
                                window.location.href = "home.html";
                             </script>`);
        } else {
            return res.send(`<script>
                                alert("Invalid email or password.");
                                window.location.href = "login27.html";
                             </script>`);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
