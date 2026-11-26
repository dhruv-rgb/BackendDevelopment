const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('Set SESSION_SECRET before starting the session demo.');
}

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));

// Home route
app.get('/', (req, res) => {
    if (req.session.username) {
        res.send(`
            <h2>Welcome back, ${req.session.username}!</h2>
            <p>Student Name: Dhruv Mehta | SAP ID: 590016903</p>
            <p><a href="/logout">Click here to Logout</a></p>
        `);
    } else {
        res.send(`
            <h2>Student Portal Login</h2>
            <form action="/login" method="post">
                <label>Username: </label>
                <input type="text" name="username" value="Dhruv Mehta" required />
                <button type="submit">Login</button>
            </form>
        `);
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    res.cookie('user_theme', 'dark_mode', { maxAge: 900000, httpOnly: true });
    res.redirect('/');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
