const express = require("express"),
    morgan = require("morgan");
const app = express();

// Top 10 Movies
let topMovies = [
    {
        name: "Shrek",
        released: "2001",
        boxOffice: "$492.2 million"
    },
    {
        name: "Scott Pilgrim vs. the World",
        released: "2010",
        boxOffice: "$49.3 million"
    },
    {
        name: "The Conjuring",
        released: "2013",
        boxOffice: "$319.5 million"
    },
    {
        name: "Barbie",
        released: "2023",
        boxOffice: "1.446 billion"
    },
    {
        name: "Get Out",
        released: "2017",
        boxOffice: "$255.4 million"
    },
    {
        name: "Spirited Away",
        released: "2002",
        boxOffice: "$395.8 million"
    },
    {
        name: "The Addams Family",
        released: "1991",
        boxOffice: "$191.5 million"
    },
    {
        name: "The Menu",
        released: "2022",
        boxOffice: "$79.6 million"
    },
    {
        name: "Free Solo",
        released: "2018",
        boxOffice: "29.4 million"
    },
    {
        name: "The Lion King",
        released: "1994",
        boxOffice: "$968.4 million"
    }
]


app.use(morgan("combined"));
app.use(express.static("public"));

app.get("/movies", (req, res, next) => {
    res.json(topMovies);
});

app.get("/", (req, res, next) => {
    res.send("Welcome to myFlix!");
});

// request listener
app.listen(8082, () => {
    console.log("Listening on port 8081");
});

// error handling for 500s
app.use((err, res, req, next) => {
    console.error(err.stack);
    res.status(500).send("Oh no, something is broken!");
});