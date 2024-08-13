import { withStyles, makeStyles, Button, Grid } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate } from 'react-router-dom';
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
    const [groupsList, setGroupsList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [contactInfo, setContactInfo] = useState([]);
    const navigate = useNavigate();
    const navis = [() => { navigate('/search'); }, () => { localStorage.setItem("uidContext", user?._id); navigate('/profile'); }, () => {}]
    const classes = useStyles();
    const {ready, user} = useContext(UserContext);

    // if (ready && user === null) {
    //     return <Navigate to="/" replace={true}/>;
    // }

    if (!ready) {
        return "Loading...";
    }

    return (
        user === null ? <Navigate to="/" replace={true}/> : <div style={{flexDirection: 'column'}}>
            <Header isLogin={true} classes={classes} title={user?.username} selected={"Chat"} navis={navis} login={true}></Header>
            <Grid container direction="row" style={{paddingTop: 60, height:"calc(100vh - 74px)"}}>
                <Grid item style={{width:"35%"}}>
                    <Contacts contactInfo={contactInfo} 
                            groupsList={groupsList}
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