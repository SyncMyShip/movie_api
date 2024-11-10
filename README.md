# myFlix API
myFlix is an application that provides users with a bank of information about users, directors, and genres. Users will have the ability to navigate through a wide range of movies and learn about their corresponding director(s) and genre(s). Users will also have the option to manage a list of their favorite movies. This API provides the backend components necessary to interact with the myFlix client. 

## Key Features
- Sign Up and Login options 
- A centralized home page that provies users with a list of movies and their details.
- The option for a user to add or remove a movie from their favorites list.
- The ability for users to update their user details.
- The option for a user to deregister their myFlix account.

## Technologies
- Node.js
- Express
- MongoDB
- CORS
- JWT Tokens

## Endpoints 

### Users

Allow users to signup
- POST /signup

Allow users to login
- POST /login

Return details about a user
- GET /users/:Username

Update user details
- PUT /users/:Username

Add movie to favorites list
- POST /users/:Username/movies/:MovieID 

Delete movie from favorites list
- DELETE /users/:Username/movies/:MovieID

Delete user
- DELETE /users/:Username


### Movies

Return a list of all movies
- GET /movies

View movie details by title
- GET /movies/:Title

View genre details
- GET /movies/genres/:Name

View director details
- GET /movies/directors/:Name


