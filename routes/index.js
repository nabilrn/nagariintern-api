const express = require('express');
const router = express.Router();

// Basic route
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

module.exports = router;