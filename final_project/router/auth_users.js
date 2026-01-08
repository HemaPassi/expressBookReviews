const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
              
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return !users.find(u => u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user= users.find(userDetail => userDetail.username == username && userDetail.password == password) 
     return !!user
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body

  if(!username || !password) {
    return regd_users.status(400).join({message: 'Please enter User Name and password ' })
  }
  if(!authenticatedUser(username, password)) {
    return res.status(401).json(message: 'Invalid deatils')
  }

  const token = jwt.sign({username}, 'access', {expireIn: '2h'})
  req.session.authorization = { token, username}

  return res.status(200).json({message: "User is loggedin successfully"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
const isbn = req.params.isbn;
const review= req.body.review;
const username = req.sessionStore.authorization?.username;
if(!username) {
    return res.status(401).json({message: 'USer not found'})
}
if(!books[isbn]) {
    return res.status().json({message: 'Book not found'})
}
if(!review) {
    return res.status(400).json({message: "reviwe is required"})
}
//add and udpate reviwe 
books[isbn].reviews[username]= review;
  return res.status(200).json({message: "Review added"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
