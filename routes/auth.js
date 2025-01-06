const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verifyToken, refreshToken } = require('../middleware/AuthMiddleWare');


router.post('/login', authController.login);


router.post('/refresh-token', refreshToken);


router.get('/protected-route', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;