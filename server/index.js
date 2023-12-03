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


//Endpoint for adding a new user
app.post('/api/auth/loginInfo/', (req, res) => {
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
