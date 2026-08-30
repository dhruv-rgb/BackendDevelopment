const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Route to set a cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'DhruvMehta_590016903', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set! Visit /get-cookie to read it.');
});

// Route to read the cookie
app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];
    if (user) {
        res.send(`Cookie Retrieved: ${user}`);
    } else {
        res.send('No cookie found. Please visit /set-cookie first.');
    }
});

// Route to delete the cookie
app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted successfully.');
});

app.listen(3000, () => {
    console.log('Cookie demo running on http://localhost:3000');
});
