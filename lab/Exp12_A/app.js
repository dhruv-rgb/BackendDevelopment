const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// ============================================================
// PART A - Basic Route
// ============================================================
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js and Express Lab - Dhruv Mehta (SAP: 590016903)!');
});

// ============================================================
// PART B - Route Parameters (URL Parameters)
// ============================================================

// Single URL parameter: /user/590016903
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.json({
        message: 'User details fetched successfully',
        userId: userId
    });
});

// Multiple URL parameters: /product/electronics/101
app.get('/product/:category/:id', (req, res) => {
    const { category, id } = req.params;
    res.json({
        category: category,
        productId: id
    });
});

// ============================================================
// Query Parameters & POST Body
// ============================================================

// Query parameters: /search?q=nodejs&limit=5
app.get('/search', (req, res) => {
    const { q, limit } = req.query;
    res.json({
        query: q,
        limit: limit
    });
});

// POST route reading JSON body
app.post('/user', (req, res) => {
    const { name, email, sap_id } = req.body;
    res.status(201).json({
        message: 'User created successfully',
        name: name,
        email: email,
        sap_id: sap_id
    });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
