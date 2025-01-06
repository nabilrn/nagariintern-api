require('dotenv').config();
const { User } = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            error: false,
            message: 'Login successful',
            token,
            refreshToken,
            role: user.role
        });
    } catch (error) {
        console.error('Error in login:', error.message || error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async (req, res) => {
    
}

module.exports = {
    login,
};