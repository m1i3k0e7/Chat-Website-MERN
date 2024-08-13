const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Chat = require("./models/Chat");
const Message = require("./models/Message");
const cookieParser = require("cookie-parser");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require("dotenv").config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
    },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

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
            biography: "Hello, I am " + username,
            password: bcrypt.hashSync(password, bcryptSalt),
            contacts: [],
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
                }, process.env.JWT_SECRET, {}, (err, token) => {
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
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
            if (err) throw err;
            const {username, _id, email} = await User.findById(user.id);
            res.json({username, _id, email});
        });
    } else {
        res.json(null);
    }
});

app.post('/apis/contacts', async (req, res) => {
    const {_id} = req.body;
    const user = await User.findById(_id).populate('contacts', 'isGroupChat _id chatName lastText lastTextTime').exec();
    const contacts = user.contacts
    res.json({contacts});
});

app.post('/apis/chat', async (req, res) => {
    const {contactInfo} = req.body;
    try {
        const contents = await Chat.findById(contactInfo[1])
        .populate({
            path: 'messages',
            select: 'content sender time isNotif',
            populate: {
                path: 'sender',
                select: 'username',
            }
        })
        .exec();
        res.status(200).json({contents})
    } catch (e) {
        console.log(e);
        res.json(422).json(e);
    }
});

app.post('/apis/createChat', async (req, res) => {
    const {chatName, isGroupChat, users, lastText, time} = req.body;
    const chat = new Chat({
        isGroupChat,
        chatName,
        users,
        messages: [],
        lastText,
        lastTextTime: time,
    });
    try {
        const savedChat = await chat.save();
        const message = new Message({
            sender: users[0],
            content: lastText,
            time: time,
            chat: savedChat._id, // new chat's id as ref
            isNotif: true,
        });
        const savedMessage = await message.save();
        await Chat.findByIdAndUpdate(savedChat._id, {
            $push: {messages: savedMessage._id}
        });
        for (user of users) {
            await User.findByIdAndUpdate(user, {
                $push: {contacts: savedChat._id}
            });
        }
        res.status(200);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/apis/sendMessage', async (req, res) => {
    const {sender, chat, content, time} = req.body;
    const newMessage = new Message({
        sender,
        chat,
        content,
        time,
        isNotif: false,
    });
    try {
        const savedMessage = await newMessage.save();
        await Chat.findByIdAndUpdate(chat, {
            $push: {messages: savedMessage._id},
            lastText: content,
            lastTextTime: time,
        });
        res.status(200);
    } catch (e) {
        res.status(422).json(e);
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinGroup', (groupId) => {
        // console.log("join ", groupId);
        socket.join(groupId);
    });

    socket.on('leaveGroup', (groupId) => {
        // console.log("leave ", groupId);
        socket.leave(groupId);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

Message.watch().on('change', async (change) => {
    if (change.operationType === 'insert') {
        const messageId = change.fullDocument._id;
        try {
            const newMessage = await Message.findById(messageId)
            .populate('sender', 'username')
            .exec();
            const groupId = newMessage.chat.toString();
            console.log('broadcast new message');
            io.to(groupId).emit('newMessage', newMessage);
        } catch (e) {
            console.log(e);
        }
    }
});

server.listen(3000, () => {});