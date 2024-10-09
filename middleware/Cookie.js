const logCookies = (req, res, next) => {
    console.log('Received Cookies:', req.cookies);
    next(); // Call the next middleware function
};

module.exports = logCookies; // Export the middleware function
