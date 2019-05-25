//required modules
const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const mongoose = require('mongoose');
const user = require('./model/schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const middelware =require('./checkAuth')
let config = require('./config');
//mongoose configuration
mongoose.connect('mongodb://localhost/QuillDate', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('database connected');
});
// configuration ends here

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.minetype==='image/jpeg' || file.minetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload =multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*8
    },
    fileFilter:fileFilter
});
const secret = "thisIsMySecretCode"

var app =express();

//middlewares
/* templating engine for dynamic comtent */
app.set('view engine','ejs');

/* middleware */
app.use('/assets',express.static('assets')); // name of the folder where my static files are (assets)
// parse application
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//routes
//get request
app.get('/', (req,res)=>{
    res.render('home');
}) 
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
 
app.get('/user/main',middelware,(req,res)=>{
   res.send('hello from main');
})

app.get('/user/profile',middelware,(req,res)=>{
    res.render('profile')
})

//post request
app.post('/signup',function(req,res,err){
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
      let newUser = new user({
        username: username,
        password: password,
        email: email
      });
      bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
          if(err){
            console.log("error 2",err);
          }
          else{
            newUser.password= hash;
            newUser.save(function(err){
              if(err)
              {
                console.log("error 3",err);
                return;
              }
              else {
                console.log('new user added');
                res.redirect('/login');
              }
            });
          }
        });
      });
  });

  app.post("/login", (req, res, next) => {
    user.findOne({ email: req.body.email })
      .exec()
      .then(User => {
      /*  if (User.length < 1) {
            console.log('fail login 1')
          return res.status(401).json({
            message: "Auth failed"
          });
        }*/
        bcrypt.compare(req.body.password, User.password, (err, result) => {
          if (err) {
              console.log('fail login 2')
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
              console.log("yey its a login")
            const token = jwt.sign(
              {
                email: User.email,
                userId:User._id
              },
              config.secret,{
                expiresIn: "1h"
            }
            );
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  app.post('/user/profile',middelware,upload.single('myImage'),(req,res)=>{
      console.log(res.file)
  })
// routes end here





app.listen(3000,()=>{
    console.log(`listening to port 3000`);
})