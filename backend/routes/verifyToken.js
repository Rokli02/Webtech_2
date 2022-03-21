const jwt = require('jsonwebtoken');
const config = require('../Config');

module.exports.authorize = function (req, res, next) {
    const token = req.header('gamepass');
    if(!token) {
        return res.status(401);
    }

    try {
        const verified = jwt.verify(token, config.jwt_secret);
        req.user = verified;
        next();
    }catch(err) {
        return res.status(401).send('TOKEN_NOT_VALID');
    }
}