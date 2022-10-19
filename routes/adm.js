
const express=require('express') ;
const fs=require('fs') ;
const bcrypt = require('bcrypt');
const path = require("path");

const router=express.Router() ;


let {admins,adm_infos}=require('../models/mdls') ;

function writeData(dt,file){
try {
  fs.writeFileSync(file, dt);
    console.log("File written successfully!");
} catch (err) {
  console.error(err);
}}

const regAdm=async (req, res) => {
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
}


router.post('/adminregister',regAdm);



// let adminLoggedIn = false ; 
// let adminId ;
let foundAdmin ;
const lgAdm = async (req, res) => {
  try{
    foundAdmin = admins.find((data) => req.body.email === data.email);
    if (foundAdmin) {

      let submittedPass = req.body.password; 
    let storedPass = foundAdmin.password; 

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
        global.adminLoggedIn = true ;
        global.adminId=foundAdmin.id ;

    res.sendFile(path.join(__dirname,'../views/adm_profile.html'));
      // res.send(`<div align ='center'><h2>Admin login successful</h2></div><br><br><br><div align ='center'><h3>Hello ADMIN ${foundAdmin.username}</h3></div><br><br><div align='center'><form action="/logout" method="GET"><button type="submit">LOGOUT</button></form></div><div align='center'><form action="/admin" method="GET"><button type="submit">Go To Admin page</button></form></div>`);
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
  res.send("Error:\n"+err); }
}

router.post('/adminlogin',lgAdm );


router.get('/admin',adminloginCheck,authAdmin, (req, res) => {
  res.send('<h1>Admin Page</h1><form action="/contr" method="GET"><button type="submit">Go And Edit</button></form>')
})

router.get('/contr',adminloginCheck,authAdmin, (req, res) => {
    res.sendFile(path.join(__dirname,'./priv/rjCnt.html'));
})


let adm_info=null ;
let foundInfo=null ;
// router.use(express.json()) ;
router.post('/ad_adm_info',adminloginCheck,authAdmin,(req,res)=>{
  console.log('user id:') ; console.log(global.adminId) ;
     foundInfo = adm_infos.find((data) => global.adminId === data.id);
  if(foundInfo){

  foundInfo.hdng.push(req.body.dthead) ;
  foundInfo.pst.push(req.body.dtpst) ;
  adm_info = foundInfo ;
  }
  else{
  adm_info ={
    id: global.adminId,
    hdng:[],
    pst:[]
  }
  adm_info.hdng.push(req.body.dthead) ;
  adm_info.pst.push(req.body.dtpst) ;
  adm_infos.push(adm_info) ;
  }
  // let adm_info={
  //   id: global.adminId ,
  //   hdng:  req.body.dthead,
  //   pst:  req.body.dtpst
  // } ;
if(foundInfo){

  }
            console.log('User list', adm_infos);
            writeData(JSON.stringify(adm_infos),'./adm_info.json') ;
     // foundUser.hdngs.push(req.body.hdng) ;
     // foundUser.psts.push(req.body.pst) ;
  console.log("printing what is pushing") ;
  console.log(adm_info) ;
})
router.get('/get_adm_info',(req,res)=>{
  // console.log(global.adminId) ;
    let foundInfo = adm_infos.find((data) => global.adminId === data.id);
  console.log(foundInfo) ;
  res.send(foundInfo) ;

})
router.get('/get_adm_posts',(req,res)=>{
  // let snd_infos={
  //   name:foundAdmin.username ,
  //   infos: adm_infos
  // }
  res.send(adm_infos) ;
})




function adminloginCheck(req,res,next) {
  if(global.adminLoggedIn){
    req.admin = global.adminId ;
  }
  else {
    req.admin = null ;
  }
  next() ; 
}


function authAdmin(req, res, next) {
  if (req.admin == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}


// console.log(adminId,adminLoggedIn) ;
module.exports={
  router
};
