const express = require("express"),
    bodyParser = require('body-parser');


const app = express();


const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://127.0.0.1:27017/movie-api-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const { check, validationResult } = require('express-validator');


// Middleware definitions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const cors = require('cors');
app.options('*', cors()) // enable pre-flight access
// app.use(cors()); // this syntax allows access from world
let auth = require('./auth')(app);


const passport = require('passport');
require('./passport.js');

// CORS Definition
let allowedOrigins = [
    'http://localhost:1234',
    'http://localhost:4200',
    'http://localhost:8080', 
    'https://reelvouz.netlify.app', 
    'https://deploy-preview-13--reelvouz.netlify.app',
    'https://reelvouz.netlify.app',
    "https://reelrendezvous-angular.netlify.app",
    'https://syncmyship.github.io'
] // TODO: whitelist frontend app

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // origin not found on list
            let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));


/**
 * GET /
 * @name home
 * @function
 */
app.get("/", (req, res, next) => {
    res.send("Welcome to myFlix!");
});


/**
 * GET /movies
 * @name getAllMovies
 * @function
 * @returns {Array} List of movies:<br>
 *  <pre>
    {
        "Genre": {
            "Name": string,
            "Description": string
        },
        "Director": {
            "Name": string,
            "Bio": string
        },
        "_id": string,
        "Title": string,
        "Description": string,
        "Released": string,
        "Featured": boolean
    }   
    </pre>
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});


/**
 * GET /movies/:Title
 * @name getMovie
 * @function
 * @param {string} Title - The title of the movie.
 * @returns {Object} An object containing the following movie details:<br>
 *  <pre>
    {
        "Genre": {
            "Name": string,
            "Description": string
        },
        "Director": {
            "Name": string,
            "Bio": string
        },
        "_id": string,
        "Title": string,
        "Description": string,
        "Released": string,
        "Featured": boolean
    }
    </pre>
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err),
            res.status(500).send('Error: ' + err)
        })
});


/**
 * GET /movies/genres/:Name
 * @name getGenre
 * @function
 * @param {string} Name - genre name
 * @returns {Object} Genre details:<br>
 *  <pre>
    {
        "Name": string,
        "Description": string
    }
    </pre>
 */
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Name })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
});


/**
 * GET /movies/directors/:Name
 * @name getDirector
 * @function
 * @param {string} Name - director name
 * @returns {Object} Director details:<br>
 *  <pre>
    {
        "Name": string,
        "Bio": string
    } 
    </pre>
 */
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Name })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
});


/**
 * POST /signup
 * @name userSignup
 * @function
 * @returns {Object} New user object:<br>
 *  <pre>
    {    
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string
    }
    </pre>
 */
app.post('/signup',
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Name: req.body.Name,
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        DateOfBirth: req.body.DateOfBirth
                    })
                    .then((user) => {
                        res.status(201).json(user)
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err)
                    })
            }
        })
});


/**
 * GET /users/:Username
 * @name getUser
 * @function
 * @param {string} Username - username
 * @returns {Object} User details:<br>
 *  <pre>
    {
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string,
        "FavoriteMovies": [],
        "_id": string,
        "__v": int
    }
    </pre>
 */
app.get('/users/:Username', 
    passport.authenticate('jwt', { session: false }), async (req, res) => {
        await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
})


/**
 * PUT /users/:Username
 * @name updateUser
 * @function
 * @param {string} Username - username
 * @returns {Object} Updated user details:<br>
 *  <pre>
    {
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string,
        "FavoriteMovies": [],
        "_id": string,
        "__v": int
    }
    </pre>
 */
app.put('/users/:Username', 
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    ], passport.authenticate('jwt', { session: false }), async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.user.Username !== req.params.Username) {
            return res.status(400).send('Permission denied');
        }
        await Users.findOneAndUpdate({ Username: req.params.Username },
            { $set: {
                Name: req.body.Name,
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                DateOfBirth: req.body.DateOfBirth
            }},
            { new: true })
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
})


/**
 * POST /users/:Username/movies/:MovieID
 * @name addFavorite
 * @function
 * @param {string} Username - username
 * @param {string} MovieID - ID of the movie to add to favorites
 * @returns {Object} User details:<br>
 *  <pre>
    {
        "_id": string,
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string,
        "FavoriteMovies": [],
        "__v": int
    }
    </pre>
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
});


/**
 * DELETE /users/:Username/movies/:MovieID
 * @name deleteFavorite
 * @function
 * @param {string} Username - username
 * @param {string} MovieID - ID of the movie to remove from favorites
 * @returns {Object} User details:<br>
 *  <pre>
    {
        "_id": string,
        "Name": string,
        "Username": string,
        "Password": string,
        "Email": string,
        "DateOfBirth": string,
        "FavoriteMovies": [],
        "__v": int
    }
    </pre>
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
        })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
    })
});


/**
 * DELETE /users/:Username
 * @name deleteUser
 * @function
 * @param {string} Username - username
 * @returns {string} Confirmation message:<br>
 *  <pre>
        <user> was deleted
    </pre>
 */

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found')
            } else {
                res.status(200).send(req.params.Username + ' was deleted')
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
});


// request listener
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});

// error handling for 500s
app.use((err, res, req, next) => {
    console.error(err.stack);
    res.status(500).send("Oh no, something is broken!");
});