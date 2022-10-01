const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const fs=require('fs') ;

// const users = require('./data').userDB;
let users ;
try {
  const data = fs.readFileSync('users.json', 'utf8');
  console.log(data);
  users = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}
let admins ;
try {
  const data = fs.readFileSync('admins.json', 'utf8');
  console.log(data);
  admins = JSON.parse(data) ;
} catch (err) {
  console.error(err);
}

let fares ;
try {
  const fdata = fs.readFileSync('fares.json', 'utf8');
  console.log(fdata);
  fares = JSON.parse(fdata) ;
} catch (err) {
  console.error(err);
}
const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./pub')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./pub/ind.html'));
});

function writeData(dt,file){
try {
  fs.writeFileSync(file, dt);
    console.log("File written successfully!");
} catch (err) {
  console.error(err);
}}

app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => {
      return req.body.email === data.email ;
      });
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
            writeData(JSON.stringify(users),'./users.json') ;
            
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch(err){
        res.send("Error:\n"+err);
    }
});

app.post('/adminregister', async (req, res) => {
    try{
        let foundAdmin = admins.find((data) => {
      return req.body.email === data.email ;
      });
        if (!foundAdmin) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            admins.push(newUser);
            console.log('Admins list', admins);
            writeData(JSON.stringify(admins),'./admins.json') ;
            
            res.send("<div align ='center'><h2>Admin Registration successful</h2></div><br><br><div align='center'><a href='./adminlogin.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>ADmin Email already used</h2></div><br><br><div align='center'><a href='./adminReg.html'>Register again</a></div>");
        }
    } catch(err){
        res.send("Error:\n"+err);
    }
});




let loggedin= false ;
let usrid ;
app.post('/login', async (req, res) => {
  try{

    let foundUser = users.find((data) => req.body.email === data.email);
    if (foundUser) {

      let submittedPass = req.body.password; 
    let storedPass = foundUser.password; 

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
        loggedin = true ;
        usrid = foundUser.id ;

      res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${foundUser.username}</h3></div><br><br><div align='center'><form action="/logout" method="GET"><button type="submit">LOGOUT</button></form></div>`);
      } else {
      res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
    }
  }
  else {

    let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
    await bcrypt.compare(req.body.password, fakePass);

    res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
  }
} catch(err){
  res.send("Error:\n"+err);
}
});



let adminloggedin= false ;
let adminid ;
app.post('/adminlogin', async (req, res) => {
  try{
    let foundAdmin = admins.find((data) => req.body.email === data.email);
    if (foundAdmin) {

      let submittedPass = req.body.password; 
    let storedPass = foundAdmin.password; 

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
        adminloggedin = true ;
        adminid=foundAdmin.id ;

      res.send(`<div align ='center'><h2>Admin login successful</h2></div><br><br><br><div align ='center'><h3>Hello ADMIN ${foundAdmin.username}</h3></div><br><br><div align='center'><form action="/logout" method="GET"><button type="submit">LOGOUT</button></form></div><div align='center'><form action="/admin" method="GET"><button type="submit">Go To Admin page</button></form></div>`);
      } else {
      res.send("<div align ='center'><h2>Invalid admin email or password</h2></div><br><br><div align ='center'><a href='./adminlogin.html'>login again</a></div>");
    }
  }
  else {

    let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
    await bcrypt.compare(req.body.password, fakePass);

    res.send("<div align ='center'><h2>Invalid admin email or password</h2></div><br><br><div align='center'><a href='./adminlogin.html'>login again<a><div>");
  }
} catch(err){
  res.send("Error:\n"+err);
}
});





app.get('/dashboard',loginCheck,authUser, (req, res) => {
  res.send('Dashboard Page')
})

app.get('/admin',adminloginCheck,authAdmin, (req, res) => {
  res.send('<h1>Admin Page</h1><form action="/contr" method="GET"><button type="submit">Go And Edit</button></form>')
})

app.get('/contr',adminloginCheck,authAdmin, (req, res) => {
    res.sendFile(path.join(__dirname,'./priv/rjCnt.html'));
})

function loginCheck(req,res,next) {
  if(loggedin || adminloggedin){
    req.user = usrid ;
  }
  else{
    req.user = null ;
  }
  next() ; 
}

function adminloginCheck(req,res,next) {
  if(adminloggedin){
    req.admin = adminid ;
  }
  else {
    req.admin = null ;
  }
  next() ; 
}

function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}

function authAdmin(req, res, next) {
  if (req.admin == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}


app.get('/getFare', (req, res) => {
   res.send(fares);
});

app.post('/addFare', async (req, res) => {
    try{
      //   let foundFare = fares.find((data) => {
      //  if(req.body.from === data.from && req.body.to === data.to) return true ; 
      // else return false ;
      // });
        if (true) {
    
            let newFare = {
                // id: Date.now(),
                from: req.body.from,
                to: req.body.to,
                fare: req.body.fare,
            };
            fares.push(newFare);
            console.log('User list', fares);
            writeData(JSON.stringify(fares),'./fares.json') ;
            
            res.send("<div align ='center'><h2>Fare add successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>FAre already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch(err){
        res.send("Error:\n"+err);
    }
});







app.get('/logout',(req,res) => {
      loggedin = false ;
      adminloggedin = false ;
    res.sendFile(path.join(__dirname,'./pub/index.html'));

}) ;




server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});
