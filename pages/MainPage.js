import { withStyles, makeStyles, Button, Grid } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../component/Header"
import Contacts from "../component/Contacts";
import Chat from "../component/Chats";
import "../style.css";
import { UserContext } from "../component/contexts/UserContext";

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
      [theme.breakpoints.down('md')]: {
        fontSize: '22px',
        },
      [theme.breakpoints.down('sm')]: {
        fontSize: '16px',
        },
    },
    groupItemContainer: {
        overflowY: "scroll",
    }
  }));

const MainPage = () => {
    const [username, setUsername] = useState("");
    const [groupsList, setGroupsList] = useState([]);
    const [contactInfo, setContactInfo] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [uid, setUid] = useState("");
    const navigate = useNavigate();
    const navis = [() => { navigate('/search'); }, () => { localStorage.setItem("uidContext", uid); navigate('/profile'); }, () => {}]
    const classes = useStyles();
    const {ready, user} = useContext(UserContext);

    useEffect(() => {
        if (ready && user === null) {
            navigate("/");
        }
        setUsername(user?.username);
        setUid(user?._id);
    }, []);

    return (
        <div style={{flexDirection: 'column'}}>
            <Header isLogin={true} classes={classes} title={"Chat Room"} selected={"Chat"} navis={navis} login={true}></Header>
            <Grid container direction="row" style={{paddingTop: 60, height:"calc(100vh - 74px)"}}>
                <Grid item style={{width:"35%"}}>
                    <Contacts contactInfo={contactInfo} 
                            groupsList={groupsList} 
                            username={username} 
                            setGroupsList={setGroupsList} 
                            setContactInfo={setContactInfo}
                            friendsList={friendsList}
                            setFriendsList={setFriendsList}
                    ></Contacts>
                </Grid>
                <Grid item style={{backgroundColor:"white", width:"65%"}}>
                    {contactInfo ? <Chat contactInfo={contactInfo} 
                                       setGroupsList={setGroupsList}
                                       groupsList={groupsList}
                                       setFriendsList={setFriendsList}
                                ></Chat> : <div></div>}
                </Grid>
            </Grid>
        </div>
    );
};

export default MainPage;