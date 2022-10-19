
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
