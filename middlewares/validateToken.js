const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];
       
    if(!token){
        return res.status(401).json({ message: 'Auth error.' });
    }

    try {
        const decoded = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:'Invalid token.' });
    }
} 

module.exports = validateToken;