const express = require("express"),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

// Top 10 Movies
let movies = [
    {
        title: "Shrek",
        released: "2001",
        boxOffice: "$492.2 million",
        genre: [
            "Comedy"
        ]
    },
    {
        title: "Scott Pilgrim vs. the World",
        released: "2010",
        boxOffice: "$49.3 million",
        genre: [
            "Comedy",
            "Action",
            "Fantasy"
        ]
    },
    {
        title: "The Conjuring",
        released: "2013",
        boxOffice: "$319.5 million",
        genre: [
            "Horror",
            "Thriller"
        ]
    },
    {
        title: "Barbie",
        released: "2023",
        boxOffice: "1.446 billion",
        genre: [
            "Comedy"
        ],
    },
    {
        title: "Get Out",
        released: "2017",
        boxOffice: "$255.4 million",
        genre: [
            "Horror",
            "Thriller",
            "Suspense"
        ]
    },
    {
        title: "Spirited Away",
        released: "2002",
        boxOffice: "$395.8 million",
        genre: [
            "Action",
            "Fantasy"
        ]
    },
    {
        title: "The Addams Family",
        released: "1991",
        boxOffice: "$191.5 million",
        genre: [
            "Comedy",
            "Dark"
        ]
    },
    {
        title: "The Menu",
        released: "2022",
        boxOffice: "$79.6 million",
        genre: [
            "Thriller",
            "Suspense"
        ]
    },
    {
        title: "Free Solo",
        released: "2018",
        boxOffice: "29.4 million",
        genre: [
            "Documentary",
            "Action",
            "Adventure"
        ]
    },
    {
        title: "The Lion King",
        released: "1994",
        boxOffice: "$968.4 million",
        genre: [
            "Adventure",
            "Musical"
        ]
    }
]

let directors = [
    {
        id: "D0001",
        name: "Greta Gerwig",
    }
]

let genres = [
    {
        id: "G0001",
        name: "Comedy",
        description: "Comedy description goes here"
    },
    {
        id: "G0002",
        name: "Horror",
        description: "Horror description goes here"
    }
]

let users = [
    {
        id: "U0001",
        name: "Jane Doe",
        username: "jdoe",
        favorites: [
            {
                title: "The Lion King",
                released: "1994",
                boxOffice: "$968.4 million",
                genre: [
                    "Adventure",
                    "Musical"
                ]
            },
            {
                title: "The Menu",
                released: "2022",
                boxOffice: "$79.6 million",
                genre: [
                    "Thriller",
                    "Suspense"
                ]
            },
            {
                title: "Spirited Away",
                released: "2002",
                boxOffice: "$395.8 million",
                genre: [
                    "Action",
                    "Fantasy"
                ]
            }
        ]
    }
]


// Middleware definitions
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", (req, res, next) => {
    res.send("Welcome to myFlix!");
});


// Returns the list of ALL movies
app.get('/movies', (req, res) => {
  res.json(movies);
});


// Returns data about a single movie by title
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => 
    { return movie.title === req.params.title }));
});


// Returns data about a genre by name/title
app.get('/genres/:name', (req, res) => {
    res.json(genres.find((genre) => 
    { return genre.name === req.params.name }));
})


// returns data about a director by name
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) =>
    { return director.name === req.params.name }))
})


// Allows a new user to register
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const msg = "Missing name in request body";
        res.status(400).send(msg);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send("Registration successful");
    }
});


// Allow users to update their username
app.put('/users/:id', (req, res) => {
    let user = users.find((user) => { return user.id === req.params.id });

    if (!user) {
        res.status(400).send('User does not exist');

    } else {
        user.username = req.body.username
        res.status(201).send('Username has successfully been updated\n\n' + 'New username: ' + req.body.username)
    }
})


// Allow users to add a movie to their favorites list
app.put('/users/:id/favorites', (req, res) => {
    let newFavorite = req.body.favorites;
    let user = users.find((user) => { return user.id === req.params.id });

    if (!user) {
        res.status(400).send("User not found");
    } else {
        favorites = newFavorite;
        res.status(201).send(newFavorite.title + " has been added to your favorites");   
    }
})


// Allow users to remove a movie from their favorites list
app.delete('/users/:id/favorites', (req, res) => {
    let removedFavorite = req.body;
    let user = users.find((user) => { return user.id === req.params.id });

    if (user) {
        users = users.filter((movie) => { return movie.favorites !== removedFavorite });
        res.status(201).send(req.body.title + " has been removed from your favorites");
    }
});


// Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
    let userToRemove = req.body;
    let user = users.find((user) => { return user.id === req.params.id });

    if (user) {
        users = users.filter((movie) => { return movie.id !== userToRemove.id });
        res.status(201).send("User has been removed")
    }
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