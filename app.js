const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.js')[env];
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const proxyRouter = require("./routes/proxy");
const adminRouter = require("./routes/admin");

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// API routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", proxyRouter);
app.use("/admin", adminRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});