const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message: " Username and pasword required "})
    }
    const userAlreadyExist = users.find(u => username == username)
    if(userAlreadyExist) {
        return res.status(409).json({message: " User already exists"})
    }
    users.push({username, password})
  return res.status(201).json({message: "User is registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    const books_data=res.json(books, null, 2)  
  return res.status(300).json({message: books_data});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
    const isbn=req.params.isbn
   const book = Object.values(books).find(b => b.isbn == isbn )
   if(!book) {
    return res.status(404).json({error: " booksnot found"})
   }
    return res.status(200).json({message: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author= req.params.author.toLowerCase()
    const booksArr =[]

    const keys= Object.keys(books)
    keys.forEach(key => {
        const book= books[key]
        if(book.author.toLowerCase() == author) {
            booksArr.push(book)
        }
    })
    if(booksArr.length == 0) {
        return res.status(404).json({message: 'no books of the this author found' })
    }
    res.send(booksArr)
  return res.status(200).json({message: "book found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase()
    const booksArr =[]

    const keys= Object.keys(books)
    keys.forEach(key => {
        const book= books[key]
        if(book.title.toLowerCase() == title) {
            booksArr.push(book)
        }
    })
    if(booksArr.length == 0) {
        return res.status(404).json({message: 'no books of the this title found' })
    }
    res.send(booksArr)

  return res.status(300).json({message: "book of this title found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn
    const book = Object.values(books).find(b => b.isbn == isbn )
    if(!book) {
     return res.status(404).json({error: " reviwe not found"})
    }
    res.send(book)
  return res.status(200).json({message: "book found"});
});

module.exports.general = public_users;
