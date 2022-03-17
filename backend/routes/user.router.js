const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('../validators/UserValidator');
const config = require('../Config');
const verify = require('./verifyToken');

let User = require('../models/User');
let UserItem = require('../models/UserItem');
let Item = require('../models/Item');
const router = express.Router();

router.post('/registration', async (req, res) => {
    //params validated
    if(!validator.nameValidator(req.body.name)){
        console.log('Username is not valid!');
        return res.status(406).send('Username is not valid!');
    }
    if(!validator.emailValidator(req.body.email)){
        console.log('email is not valid!');
        console.log(req.body.email);
        return res.status(406).send('Email is not valid!');
    }
    if(!validator.passwordValidator(req.body.password)){
        console.log('password is not valid!');
        return res.status(406).send('Password is not valid!');
    }
    if(!validator.genderValidator(req.body.gender)) {
        console.log('gender is not valid!');
        return res.status(406).send('Gender is not valid!');
    }

    //checking if username already exists
    const usernameExists = await User.findOne({name: req.body.name});
    if(usernameExists){
        console.log('Username exists!');
       return res.status(400).send('Username already exists!');
    }

    //checking if email already exists
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists){
        console.log('email exists!');
        return res.status(400).send('Email already exists!');
     }

    //Hide password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    
    //insert new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        gender: req.body.gender
    });

    console.log('Ready to insert new user');
    try{
        const savedUser = await user.save();
        console.log('inserted');
        res.status(201).send(savedUser._id);
    }catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //params validated
    if(!validator.nameValidator(req.body.name)){
        return res.status(406).send('Username is not valid!');
    }
    if(!validator.passwordValidator(req.body.password)){
        return res.status(406).send('Password is not valid!');
    }

    //checking name, if exists
    const user = await User.findOne({name: req.body.name});
    if(!user) {
       return res.status(400).send('Username doesn\'t exists!');
    }

    //compare password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) {
        return res.status(400).send('Password doesn\'t match!');
    }

    //let the damn boy login
    const token = jwt.sign({_id: user._id}, config.jwt_secret, { expiresIn: "30 minutes"});
    res.send({uid: user._id, email: user.email, gender: user.gender, token: token});
});

router.get('/wishlist', verify.authorize, async (req, res) => {
    if(!req.query.uid) {
        return res.status(400);
    }
    if(req.query.uid !== req.user._id) {
        return res.status(403).send('Can\'t access another user\'s wishlist!');
    }

    let filter = '';
    if(req.query.filter){
        filter = req.query.filter;
    }
    
    const userItemFromDb = await UserItem.find({uid: req.query.uid})
    if(!userItemFromDb) {
        return res.status(204).send('There are no items on wishlist!');
    }
    
    itemIds = userItemFromDb.map((value, index, arr) => {
        return value.itemId;
    });
    
    const useritems = (await Item.find({_id: { $in : itemIds}, name: { $regex : filter, $options : "i"}})).map((value, index, arr) => {
        return {item: value, amount: userItemFromDb.find(val => val.itemId == value._id.toString()).amount };
    });

    res.status(200).json(useritems);
});

router.post('/wishlist/add', verify.authorize, async (req, res) => {
    if(!req.query.id || !req.query.uid) {
        return res.status(404);
    }

    if(req.query.uid !== req.user._id) {
        return res.status(403).send('Can\'t add to another user\'s wishlist!');
    }

    const validItem = await Item.findOne({_id: req.query.id});
    if(!validItem){
        return res.status(401);
    }

    const existsUseritem = await UserItem.findOne({uid: req.query.uid, itemId: req.query.id});
    if(existsUseritem){
        return res.status(400).send('Már fel van véve!');
    }

    const userItem = new UserItem({
        uid: req.query.uid,
        itemId: req.query.id,
        amount: 1
    });

    try {
        const savedUser = await userItem.save();
        res.status(201).json(savedUser._id);
    } catch(err) {
        return res.status(400).send(err);
    }
});

router.patch('/wishlist/update/:amount', verify.authorize, async (req, res) => {
    if(!req.query.itemId || !req.query.uid  || !req.params.amount){
        return res.status(404).send('Could not find useritem with this parameters!');
    }

    if(req.query.uid !== req.user._id) {
        return res.status(403).send('Can\'t update another user\'s wishlist!');
    }

    try {
    const userItemExists = await UserItem.findOneAndUpdate({uid: req.query.uid, itemId: req.query.itemId}, {$set: {amount: req.params.amount}});
    return res.status(202).send(userItemExists);
    }catch(err) {
        return res.status(400).send(err);
    }
});

router.delete('/wishlist/delete', verify.authorize, async (req, res) => {
    if(!req.query.uid || !req.query.itemId){
        return res.status(404).send('Could not find useritem!');
    }

    if(req.query.uid !== req.user._id) {
        return res.status(403).send('Can\'t delete from another user\'s wishlist!');
    }

    try {
    const deletedItem = await UserItem.findOneAndRemove({uid: req.query.uid, itemId: req.query.itemId});
    res.send(deletedItem);
    } catch(err) {
        return res.status(400).send(err);
    }

});

module.exports = router;