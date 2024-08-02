const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const { NormalModule } = require("webpack");
require("dotenv").config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync();
const jwtSecret = "ion13pp2m4pn6as82m238n3";

app.use(express.json());
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URL);

app.get('/apis/test', (req, res) => {
    res.json("test ok");
});

app.post('/apis/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            email, 
            bio: "",
            password: bcrypt.hashSync(password, bcryptSalt),
            groups: {},
            friends: {},
        });
        res.status(200).json(userDoc)
    } catch (e) {
        res.status(422).json(e)
    }
});

app.post('/apis/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const userDoc = await User.findOne({email});
        if (userDoc) {
            const passwordValid = bcrypt.compareSync(password, userDoc.password);
            if (passwordValid) {
                jwt.sign({
                    email: userDoc.email, 
                    id: userDoc._id, 
                }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userDoc);
                });
            } else {
                res.status(422).json('Invalid password');
            }
        } else {
            res.status(422).json('Invalid email');
        }
    } catch (e) {
        res.status(422).json(e);
    }
});

app.get('/apis/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const userDoc = await User.findById(user.id);
            res.json(userDoc);
        });
    } else {
        res.json(null);
    }
});

app.listen(3000, () => {});