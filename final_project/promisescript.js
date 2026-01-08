const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/promise-demo', (req, res) => { 
//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})

//Console log before calling the promise
console.log("Before calling promise");

//Call the promise and wait for it to be resolved and then print a message.
myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
    res.status(200).json({message: successMessage})
  }).catch((err) => {
    res.status(500).json({message: "Promise rejected"})
})
})

  //Console log after calling the promise
  console.log("After calling promise");

public_users.get('/promise-books', (req,res) => {
    axios.get('http://localhost:5000/customer/')
    .then(response => {
        return res.status(200).json({message: 'Promise: books fetched.', books:response.data.books })
    }).catch(error => {
        return res.status(500).json({message: 'Error found', error: error.message})
    })
})

public_users.get('/async-books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/customer')
        return res.status(200).json({message: 'get fetched using async/await', books: response.data.books})
    } catch(error) {
        return res.status(500).json({message: 'Error found'})
    }
})


public_users.get('/promise-isbn/:isbn', (req,res) => {
    const isbn= req.params.isbn;
    axios.get(`http://localhost:5000/customer/isbn/${isbn}`)
    .then(response => {
        return res.status(200).json({message: 'Promise: book fetched.', book:response.data.book })
    }).catch(error => {
        return res.status(500).json({message: 'Error found', error: error.message})
    })
})

public_users.get('/async-isbn/:isbn', async (req, res) => {
    const isbn= req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/customer/isbn/${isbn}`)
        return res.status(200).json({message: 'get fetched using async/await', book: response.data.book})
    } catch(error) {
        return res.status(500).json({message: 'Error fecthing in book'})
    }
})

//---------------------------


public_users.get('/author/:author', (req,res) => {
    const isbn= req.params.author.toLowerCase();
    const booksArr = Object.values(books).filter(boook => book.author.toLowerCase())

   if(booksArr.length === 0) {
         return res.status(404).json({message: 'No book by this author found.' })
    }
       return res.status(200).json({books: booksArr})
})


//---------------- task 13

public_users.get('/promise-title/:title', (req,res) => {
    const isbn= req.params.title;
    axios.get(`http://localhost:5000`)
    .then(response => {
        return res.status(200).json({message: 'Promise: book fetched by title.', books:response.data.books })
    }).catch(error => {
        return res.status(500).json({message: 'Error found', error: error.message})
    })
})

public_users.get('/async-title/:title', async (req, res) => {
    const title= req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/customer/title/${title}`)
        return res.status(200).json({message: 'get fetched by title using async/await', books: response.data.books})
    } catch(error) {
        return res.status(500).json({message: 'Error fecthing in book'})
    }
})



// public_users.get('/promise-author/:author', (req,res) => {
//     const author= req.params.author.toLowerCase();
//  axios.get(`http://localhost:5000/customer/author/${author}`)
//     .then(response => {
//         return res.status(200).json({message: 'book fetched.', books:response.data.books })
//     }).catch(error => {
//         return res.status(500).json({message: 'Error found', error: error.message})
//     })
// })

// public_users.get('/promise-author/:author', async (req, res) => {
//     const author= req.params.author;
//     try {
//         const response = await axios.get(`http://localhost:5000/customer/author/${author}`)
//         return res.status(200).json({message: 'get fetched using async/await', books: response.data.books})
//     } catch(error) {
//         return res.status(500).json({message: 'Error fecthing in book'})
//     }
// })

module.exports = public_users;