const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Released: Date,
    Genre: {
        Name: String, 
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    ImagePath: {type: String},
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    DateOfBirth: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bycrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bycrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);

let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;