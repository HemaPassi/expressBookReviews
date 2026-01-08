const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "Secret";

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
   const { username, password } = req.body
  
    const user = users.find(u => u.username === username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid details..." });
    }
  
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "3h" });

  return res.json({message: "User is loggedin successfully",token});
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
  return res.status(200).json({message: "Review added. ", reviews:books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
