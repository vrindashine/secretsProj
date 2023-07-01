//jshint esversion:6
require('dotenv').config()
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const salt = bcrypt.genSaltSync(10);
const app= express();


//const  encrypt=require('mongoose-encryption')
const md5=require('md5')
//console.log(process.env.API_KEY);
console.log(md5("123456"))

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema= new mongoose.Schema({
    email:String,
    password:String
});


//userSchema.plugin(encrypt, { secret: process.env.API_KEY ,encryptedFields: ['password'] });

const User=new mongoose.model('User',userSchema)
app.get('/',function(req,res)
{
    res.render("home");
});

app.get('/login',function(req,res)
{
    res.render('login')
});
app.get('/register',function(req,res)
{
    res.render('register')
});

app.post('/register',function(req,res)
{
    var hash = bcrypt.hashSync("req.body.password", salt);
    const newUser=new User({
        email:req.body.username,
        password:hash
    });
   newUser.save().then(function(err)
    { 
   
         res.render('secrets');
    }).catch(function(err)
    {
        console.log(err);
    });
});

app.post('/login',function(req,res)
{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(function(foundUser)
    {
        bcrypt.compare("password", foundUser.password).then(function(result){
            res.render('secrets');
        });
    }).catch(function(err)
    {
        console.log(err);
    });
});
app.listen(3000,function()
{
    console.log("server started on port 3000");
});
