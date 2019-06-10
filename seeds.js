const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost/shop',{useNewUrlParser:true});

const User = require('./models/user');
const Product = require('./models/product');
const Admin = require('./models/admin');

const authSzyfr = require('./szyfr/szyfr');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{

    console.log('ok');

    Product.find().then(result=>{
        console.log(result);
        app.locals.products = [...result];
        res.send(app.locals.products);
    }).catch(err=>{console.log(err)});

    
});


app.post('/dodajProduct',(req,res)=>{

    const product = req.body;
    const newAuth = authSzyfr();
    const newProduct = new Product({
        ...product
    });
    newProduct._id = new mongoose.Types.ObjectId;
    newProduct.authId=newAuth;
    newProduct.save()
    .then(result=>{
        res.status(200).send(newProduct);
    })
    .catch(err=>console.log(err));;
   
})

app.post('/addUser',(req,res)=>{

    const user = req.body;
    const newAuth = authSzyfr();
    const newUser = new User({
        ...user
    });
    newUser._id = new mongoose.Types.ObjectId;
    newUser.password = authSzyfr();
    newUser.authId=newAuth;
    newUser.shoppingCart = [];
    newUser.save().then(result=>{
        res.status(200).send(newUser);
    }).catch(err=>console.log(err));;
    
});

app.post('/addAdmin',(req,res)=>{

    const user = req.body;
    const newAuth = authSzyfr();
    const newAdmin = new Admin({
        ...user
    });
    newAdmin._id = new mongoose.Types.ObjectId;
    newAdmin.password = authSzyfr();
    newAdmin.adminAuthId=newAuth;
    newAdmin.save()
    .then(result=>{
        res.status(200).send(newAdmin);
    })
    .catch(err=>console.log(err));;
    
});



app.listen(3000,()=>{
    console.log('Server is running...');
})