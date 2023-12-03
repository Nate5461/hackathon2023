const express = require('express');
const fs = require('fs'); 



const app = express();
const port = 3000;


app.use('/', express.static('../frontend'));

//More middleware for json parsing
app.use(express.json());

// Serve static files from the "assets" directory
app.use('/assets', express.static('../assets'));

//Set up middleware
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
})



// Send JSON file for the first route
app.get('/api/auth/loginInfo', (req, res) => {
    fs.readFile('./userData.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
});

app.get('/api/file/fileInfo', (req, res) => {
    fs.readFile('./fileData.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'key'; // Replace with your actual secret key

app.post('/api/auth/signin', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('./userData.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.username === username && user.password === password);

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        res.json({ token });
    });
});

//Post request for adding a new file
app.post('/api/file/fileInfo', (req, res) => {
    const fileData = req.body; // req.body is already an object

    fs.readFile('./fileData.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    
        let existingData = JSON.parse(data);
    
        if (!existingData.notes) {
            existingData.notes = []; // Initialize with an empty array if it's not an array
        }
    
        existingData.notes.push(fileData);
    
        fs.writeFile('./fileData.json', JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
    
            res.json({ success: true });
        });
    });
});

app.put('/api/file/fileInfo', (req, res) => {
    console.log(req.body);
    const { title, content } = req.body; // changed 'text' to 'content'

    fs.readFile('./fileData.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        let existingData = JSON.parse(data);

        let note = existingData.notes.find(note => note.title === title);
        console.log(note);
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }

        note.content = content; // changed 'text' to 'content'
        console.log(existingData);
        fs.writeFile('./fileData.json', JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({ success: true });
        });
    });
});


//Endpoint for adding a new user
app.post('/api/auth/register', (req, res) => {
    const userData = req.body;

    fs.readFile('./userData.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        let existingData = JSON.parse(data);

        // Assuming your JSON file initially contains an array
        existingData.push(userData);

        fs.writeFile('./userData.json', JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            res.json({ success: true });
        });
    });
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
