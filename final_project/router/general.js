const express = require('express');
const axios = require('axios');
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
    const userAlreadyExist = users.find(u => u.username == username)
    if(userAlreadyExist) {
        return res.status(409).json({message: " User already exists",username})
    }
    users.push({username, password})
  return res.status(201).json({message: "User is registered ",username});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
    const isbn=req.params.isbn
   const book = books[isbn]

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

  return res.status(200).json({message: "book of this title found"});
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


public_users.get('/promise-books', (req,res) => {
    axios.get('http://localhost:5000')
    .then(response => {
        return res.status(200).json({message: 'Promise: books fetched.', books:response.data.books })
    }).catch(error => {
        return res.status(500).json({message: 'Error found', error: error.message})
    })
})

public_users.get('/async-books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000')
        return res.status(200).json({message: 'get fetched using async/await', books: response.data.books})
    } catch(error) {
        return res.status(500).json({message: 'Error found'})
    }
})


//--- ISBN

public_users.get('/promise-isbn/:isbn', (req,res) => {
    const isbn= req.params.isbn;
    axios.get(`http://localhost:5000`)
    .then(response => {
        return res.status(200).json({message: 'Promise: book fetched.', book:response.data.books[isbn] })
    }).catch(error => {
        return res.status(500).json({message: 'Error found', error: error.message})
    })
})

public_users.get('/async-isbn/:isbn', async (req, res) => {
    const isbn= req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000`)
        return res.status(200).json({message: 'get fetched using async/await', book: response.data.books[isbn]})
    } catch(error) {
        return res.status(500).json({message: 'Error fecthing in book'})
    }
})



// author
public_users.get('/author/:author', (req, res) => {
    const author= req.params.author.toLowerCase();
    const booksArr = Object.values(books).filter(book => book.author.toLowerCase() == author.toLocaleLowerCase())

   if(booksArr.length === 0) {
         return res.status(404).json({message: 'No book by this author found.' })
    }
       return res.status(200).json({books: booksArr})
})

public_users.get('/async-author/:author', async (req, res) => {
    const author= req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json({message: 'get fetched using async/await', books: response.data})
    } catch(error) {
        return res.status(500).json({message: 'Error fecthing in book'})
    }
})


//-----------------------

public_users.get('/async-title/:title', async (req, res) => {
    const title= req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`)
        return res.status(200).json({message: 'get fetched by title using async/await', books: response.data})
    } catch(error) {
        return res.status(500).json({message: 'Error fecthing in book'})
    }
})


module.exports.general = public_users;
