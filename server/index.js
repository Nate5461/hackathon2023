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
app.get('/api/loginInfo', (req, res) => {
    fs.readFile('./userData.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
