const jwt = require('jsonwebtoken');
const config = require('../Config');

module.exports.authorize = function (req, res, next) {
    const token = req.header('gamepass');
    if(!token) {
        console.log('User doesn\'t have gamepass!');
        return res.status(401);
    }

    try {
        const verified = jwt.verify(token, config.jwt_secret);
        req.user = verified;
        next();
    }catch(err) {
        console.log('Token is not valid!');
        return res.status(400);
    }
}