const express = require("express"),
    bodyParser = require('body-parser')

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/movie-api-db', { useNewUrlParser: true, useUnifiedTopology: true });


// Middleware definitions
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", (req, res, next) => {
    res.send("Welcome to myFlix!");
});


// Returns the list of ALL movies
app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});


// Returns data about a single movie by title
app.get('/movies/:Title', async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err),
            res.status(500).send('Error: ' + err)
        })
});


// Returns data about a genre by name/title
app.get('/movies/genres/:Name', async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Name })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
});


// returns data about a director by name
app.get('/movies/directors/:Name', async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Name })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        })
});


// Allows a new user to register
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Name: req.body.Name,
                        Username: req.body.Username,
                        Password: req.body.Password,
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


// Allow users to update their username
app.put('/users/:Username', async (req, res) => {
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


// Allow users to add a movie to their favorites list
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
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


// Allow users to remove a movie from their favorites list
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
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


// Allow existing users to deregister
app.delete('/users/:Username', async (req, res) => {
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
app.listen(8080, () => {
    console.log("Listening on port 8080");
});

// error handling for 500s
app.use((err, res, req, next) => {
    console.error(err.stack);
    res.status(500).send("Oh no, something is broken!");
});