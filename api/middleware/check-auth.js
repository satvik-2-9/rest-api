const jwt = require('jsonwebtoken');

/* basically abhi we havent parsed the body hence it makes more sense to pass the token
  in the header.
*/

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};