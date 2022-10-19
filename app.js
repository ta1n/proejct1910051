const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');

// const users = require('./data').userDB;
// let {admins}=require('./models/mdls') ;

// let usr ;
// try {
//   usr = fs.readFileSync('./priv/usr.html', 'utf8');
//   console.log(usr);
// } catch (err) {
//   console.error(err);
// }

const app = express();
const server = http.createServer(app);
app.set('view engine','ejs') ;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./pub')));
app.use(express.json()) ;


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./pub/ind.html'));
});

global.usrLoggedIn = false ;
global.admLoggedIn = false ;
global.adminId = null ;
global.usrId = null ;

const usrRoutes= require('./routes/usr') ;
app.use(usrRoutes.router) ;


const admRoutes= require('./routes/adm');
app.use(admRoutes.router) ;


const dbRoutes = require('./routes/db');
app.use(dbRoutes.router) ;


app.get('/logout',(req,res) => {
      global.usrLoggedIn = false ;
      global.adminloggedin = false ;
    res.sendFile(path.join(__dirname,'./pub/index.html'));

}) ;

app.use((req,res)=>{
   res.send('<h1>The requested URL not found</h1><br><h2>Please type properly</h2>') ;
});

server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});
