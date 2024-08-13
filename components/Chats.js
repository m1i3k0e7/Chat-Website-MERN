import { useState, useEffect, useRef, useContext } from "react";
import ChatItem from "./ChatItem";
import { makeStyles, TextField, Typography, Paper, Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import SearchChat from "./SearchChat";
import axios from "axios";
import { UserContext } from "./contexts/UserContext";
import { io } from "socket.io-client";


const socket = io('http://localhost:3000');

const useStyles = makeStyles((theme) => ({
    container: {
        border: "1px solid rgb(200, 200, 200)",
        height: `calc(100vh - 74px)`,
    },
    text: {
        textAlign: "center", 
        height:"70px",
        fontFamily: "H",
    },
    icon: {
        color:"black", 
        float: "right"
    },
    groupItemContainer: {
        border: "1px solid rgb(200, 200, 200)",
        height: `calc(100vh - 199px)`,
        overflowY: 'auto',
    },
    inputField: {
        minHeight: '55px',
    }, 
    textField: {
        width: 'calc(100% - 60px)',
    }
  }));

function getNowTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const hourTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');
    return [formattedTime, hourTime];
}

function calTimeDiff(time1, time2) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const diffInMs = Math.abs(date2 - date1);
    const diffInSec = Math.floor(diffInMs / 1000);

    return diffInSec >= 180;
}

async function sendMessage(content, chat, sender) {
    try {
        await axios.post('/sendMessage', {
            sender,
            chat,
            content,
            time: new Date(),
        });
    } catch (e) {
        console.log(e);
    }
} 

const Chat = ({contactInfo, setGroupsList, groupsList, setFriendsList}) => {
    const classes = useStyles();
    const [message, setMessage] = useState("");
    const [uid, setUid] = useState("");
    const [chatList, setChatList] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const groupRef = useRef(); 
    const scrollRef = useRef(null);
    const addedIds = useRef(new Map());
    const {user} = useContext(UserContext);

    useEffect(() => {
        console.log('WebSocket connection established');
        if (contactInfo.length != 0) {
            addedIds.current = new Map();
            axios.post('/chat', {
                contactInfo
            }).then(({data}) => {
                var messages = []
                for (const msg of data.contents.messages) {
                    messages.push([msg.time, msg.isNotif ? 1 : msg.sender._id, msg.content, msg.sender.username]);
                }
                setChatList(messages);
            })

            socket.emit('joinGroup', contactInfo[1]);
            socket.on('newMessage', (msg) => {
                const newMessage = [msg.time, msg.isNotif ? 1 : msg.sender._id, msg.content, msg.sender.username];
                setChatList(prev => [...prev, newMessage]);
            });

            return () => {
                socket.off('newMessage');
                socket.emit('leaveGroup', contactInfo[1]);
            };
        }
    }, [contactInfo]);

    return (
        <div className={classes.container}>
            <Typography variant="h3" className={classes.text}>
                {contactInfo ? contactInfo[0] : ""}
                <IconButton className={classes.icon} onClick={() => { setIsSearch(!isSearch); }}>
                        <SearchIcon 
                            style={{fontSize:"38px"}}>
                        </SearchIcon>
                </IconButton>
            </Typography>
            {isSearch ? <SearchChat chatList={chatList}></SearchChat> : <div></div>}
            <Paper elevation={5}>
                <Grid className={classes.groupItemContainer} ref={scrollRef}>
                    {chatList.map(([time, sender, content, senderName], index) => {
                        return (<ChatItem key={index} 
                                          time={time} 
                                          sender={sender}
                                          senderName={senderName} 
                                          self={sender===user._id} 
                                          content={content} 
                                          showName={(index !== 0 && (chatList[index][1] !== chatList[index - 1][1] && chatList[index][1] !== 1))}
                                          showTime={(index === 0 || calTimeDiff(chatList[index][0], chatList[index - 1][0]))}>
                                </ChatItem>)
                    })}
                </Grid>
                <div className={classes.inputField}>
                    <TextField 
                        id="standard-basic" 
                        label="Message" 
                        variant="outlined"
                        multiline
                        value={message}
                        className={classes.textField}
                        style={{backgroundColor: 'rgb(255, 255, 255)'}}
                        onChange={ (e) => {
                            if(e.target.value.length <= 120)
                                setMessage(e.target.value); 
                        } }
                    />
                    <IconButton className={classes.icon} onClick={() => {
                        if(message !== '') {
                            sendMessage(message, contactInfo[1], user._id);
                            setMessage("");
                        }
                    }}>
                        <SendIcon 
                            style={{fontSize:"33px"}}>
                        </SendIcon>
                    </IconButton>
                </div>
            </Paper>
        </div>
    );
}

export default Chat;