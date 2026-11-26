const express = require('express');
const session = require('express-session');

const app = express();
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('Set SESSION_SECRET before starting the session demo.');
}

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));

app.get('/', (req, res) => {
    if (req.session.views) {
        req.session.views++;
        res.send(`Welcome back, Dhruv Mehta! You visited this page ${req.session.views} times.`);
    } else {
        req.session.views = 1;
        res.send('Welcome to the session demo. Refresh this page to count your visits.');
    }
});

app.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error destroying session');
        }
        res.send('Session destroyed successfully. Refresh to start over.');
    });
});

app.listen(3000, () => {
    console.log('Session demo started on http://localhost:3000');
});
