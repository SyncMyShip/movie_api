const secretOrKey = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, secretOrKey, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * POST /login
 * @name userLogin
 * @function
 * @returns {Object} User object:<br>
 *  <pre>
    {    
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string,
        "Token": string
    }
    </pre>
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*"); 
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}
