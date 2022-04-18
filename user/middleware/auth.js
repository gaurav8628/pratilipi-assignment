const jwt = require('jsonwebtoken');


function auth (req,res,next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');
    try{
        const payload  = jwt.verify(token,'SECRET123');
        req.user = payload;
        next();
    }
    catch(err)
    {
        res.status(400).send('Invalid Token');
    }
    
}

module.exports = auth;