const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if username already exists
    if (isValid(username)) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    // Register the user
    users.push({ username, password });

    return res.status(200).json({
        message: "User registered successfully"
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
return res.send(JSON.stringify(books, null, 4));
});

public_users.get("/async/books", async (req, res) => {

    try {

        const response = await axios.get("http://localhost:5000/");

        return res.json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn], null, 4));
});


public_users.get("/promise/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    axios
        .get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.json(response.data);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        });

});
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const keys = Object.keys(books);
    const author = req.params.author;
        const result = [];


for (let i = 0; i < keys.length; i++) {
      const book = books[keys[i]];

    if (book.author === author) {
      result.push(book);
    }
}
return res.send(JSON.stringify(result, null, 4));
});

public_users.get("/async/author/:author", async (req, res) => {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/author/${author}`
        );

        return res.json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const keys = Object.keys(books);
        const title = req.params.title;
        const result = [];

        for (let i = 0; i < keys.length; i++) {
      const book = books[keys[i]];

    if (book.title === title) {
      result.push(book);
    }
}
return res.send(JSON.stringify(result, null, 4));


});

public_users.get("/async/title/:title", async (req, res) => {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/title/${title}`
        );

        return res.json(response.data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
