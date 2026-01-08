const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const JWT_SECRET = "Secret";

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/:isbn", function auth(req,res,next){
//Write the authenication mechanism here
const authHeader = req.headers['authorization']
if(!authHeader) {
    return res.status(401).json({message: 'missing authorization details'})
}
const parts=authHeader.split(' ')
if(parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({message:'authorization header is wrong' })
}
const token = authHeader.split('')[1];
if(!token) {
    return res.status(401).json({message:"Missing token" })
}

try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload;
    next()
    } catch(err) {
        return res.status(403).json({message: 'Invalid token - try again'})
    }

//return res.status(200).send('user is logged in authorized')
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
