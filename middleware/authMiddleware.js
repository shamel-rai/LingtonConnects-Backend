const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')  //gets the token either from header or cookie
            ? req.headers.authorization.split(" ")[1]
            : req.cookies?.jwt;

        console.log("Token", token);


        if (!token) {
            return res.status(401).json({ message: 'Please log in to get access' });
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        req.user = decoded;   //adding decoded info to the req object
        next();


    } catch (error) {
        return res.status(401).json({ message: 'Invalid token or authorization error' });
    }
};

module.exports = auth;
