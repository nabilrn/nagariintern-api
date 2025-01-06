const express = require("express");
const router = express.Router();

// Basic GET endpoint
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the Express Starter Project!" });
});

// Example POST endpoint
router.post("/data", (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello, ${name}!` });
});

module.exports = router;
