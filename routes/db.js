let express=require('express') ;
const fs=require('fs') ;

let {fares}=require('../models/mdls') ;

const router=express.Router() ;

function writeData(dt,file){
try {
  fs.writeFileSync(file, dt);
    console.log("File written successfully!");
} catch (err) {
  console.error(err);
}}

router.get('/getFare', (req, res) => {
   res.send(fares);
});

router.post('/addFare',loginCheck,authUser, async (req, res) => {
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
            
            // res.send("<div align ='center'><h2>Fare add successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
      res.redirect('raj_osmap.html') ;
      return ;
        } else {
            res.send("<h1>Something went wrong</h2>");
        }
    } catch(err){
        res.send("Error:\n"+err);
    }
});



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
    return res.send('<h1>You need to sign in</h1><br><a href="login.html">Sign In</a>') ;
  }

  next()
}


module.exports = {
  router
}
