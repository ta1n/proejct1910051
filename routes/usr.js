let express=require('express') ;
const fs=require('fs') ;
const bcrypt = require('bcrypt');
let {users,infos,comments}=require('../models/mdls') ;
const path = require("path");

const router=express.Router() ;



function writeData(dt,file){
try {
  fs.writeFileSync(file, dt);
    console.log("File written successfully!");
} catch (err) {
  console.error(err);
}}

router.post('/register', async (req, res) => {
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


let foundUser=null ;
router.post('/login', async (req, res) => {
  try{

    foundUser = users.find((data) => req.body.email === data.email);
    if (foundUser) {

      let submittedPass = req.body.password; 
    let storedPass = foundUser.password; 

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
        global.usrLoggedIn = true ;
        global.usrId = foundUser.id ;

    res.sendFile(path.join(__dirname,'../views/prfl.html'));
      // res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${foundUser.username}</h3></div><br><br><div align='center'><form action="/logout" method="GET"><button type="submit">LOGOUT</button></form></div>`);
        // res.render('profile',{foundUser}) ;
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


let info ;
// router.use(express.json()) ;
router.post('/adinfo',loginCheck,authUser,(req,res)=>{
  console.log('user id:') ; console.log(global.usrId) ;
    let foundInfo = infos.find((data) => global.usrId === data.id);
  if(foundInfo){

  foundInfo.hdng.push(req.body.dthead) ;
  foundInfo.pst.push(req.body.dtpst) ;
  info = foundInfo ;
  }
  else{
  info ={
    id: global.usrId,
    hdng:[],
    pst:[]
  }
  info.hdng.push(req.body.dthead) ;
  info.pst.push(req.body.dtpst) ;
  }
  // let info={
  //   id: global.usrId ,
  //   hdng:  req.body.dthead,
  //   pst:  req.body.dtpst
  // } ;

  infos.push(info) ;
            console.log('User list', infos);
            writeData(JSON.stringify(infos),'./info.json') ;
     // foundUser.hdngs.push(req.body.hdng) ;
     // foundUser.psts.push(req.body.pst) ;
  console.log("printing what is pushing") ;
  console.log(info) ;
})
router.get('/getinfo',loginCheck,authUser,(req,res)=>{
  // console.log(global.usrId) ;
    let foundInfo = infos.find((data) => global.usrId === data.id);
  // console.log(foundInfo) ;
  res.send(foundInfo) ;

})

let Cmntr ;
router.post('/adCmnt',loginCheck,authUser,(req,res)=>{
  // console.log('user id:') ; console.log(global.usrId) ;
     let foundAdCmntr = comments.find((data) => global.usrId === data.id);
  if(foundAdCmntr){

  foundAdCmntr.pst.push(req.body.dtpst) ;
  Cmntr = foundAdCmntr ;
    
            console.log('comment list', comments);
            writeData(JSON.stringify(comments),'./cmnts.json') ;
  console.log("printing what is pushing") ;
  console.log(Cmntr) ;
  res.redirect('raj_osmap.html') ;
    return ;
  }
  else{
  Cmntr ={
    id: global.usrId,
      name: users.find((data) => global.usrId === data.id).username,
    pst:[]
  }
  Cmntr.pst.push(req.body.dtpst) ;
  }
  comments.push(Cmntr) ;
            console.log('comment list', comments);
            writeData(JSON.stringify(comments),'./cmnts.json') ;
  console.log("printing what is pushing") ;
  console.log(Cmntr) ;
  res.redirect('raj_osmap.html') ;
})


router.get('/getCmnts',loginCheck,authUser,(req,res)=>{
  // console.log(global.usrId) ;
    // let foundCmntr = comments.find((data) => global.usrId === data.id);
  // console.log(foundInfo) ;
  res.send(comments) ;

})


router.get('/dashboard',loginCheck,authUser, (req, res) => {
  res.send('Dashboard Page')
})


function loginCheck(req,res,next) {
  if(global.usrLoggedIn){
    req.user = global.usrId ;
  }
  else if(global.adminloggedin){
    req.user=global.adminId ;
  }
  else{
    req.user = null ;
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


module.exports = {
  router
}
