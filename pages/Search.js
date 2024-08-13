import {makeStyles, TextField, Grid, Paper, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../component/Header"
import "../style.css";
import SearchItem from "../component/SearchItem";
import Post from "../component/Post";

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
        maxHeight: '65vh',
        overflowY: "auto",
        border: "1px solid rgb(224,224,224)",
        borderRadius: '3px'
    },
    searchField: {
        position: 'fixed',
        width: '40vw',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '2'
    },
    groupField: {
        height: '50px',
    },
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.6em',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'white'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            borderRadius: '5px',
            '&:hover': {
                backgroundColor: 'rgba(0,0,0,.4)'
            },
        }
      }
  }));

const SearchPage = () => {
    const navigate = useNavigate();
    const navis = [() => {}, () => { localStorage.setItem("uidContext", uid); navigate('/profile'); }, () => {navigate('/main')}]
    const classes = useStyles();
    const [searchGroups, setSearchGroups] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [uid, setUid] = useState('');
    const [joinMap, setJoinMap] = useState({});
    const [addMap, setAddMap] = useState({});
    
    return (
        <div style={{flexDirection: 'column'}}>
            <Header isLogin={true} classes={classes} title={"Chat Room"} selected={"Explore"} navis={navis} login={true}></Header>
            <div className={classes.searchField}>
                <TextField label="Search Group" 
                           variant="outlined" 
                           style={{width: "calc(100%)", backgroundColor: 'white'}}
                           onChange={async (e) => {
                                
                            }}
                />
                
                <div className={classes.groupField}>
                    <Grid className={classes.groupItemContainer}>
                        {searchUsers.length > 0 ? 
                            <Paper variant="outlined" style={{ "borderRadius": 0 }}>
                                <Typography>
                                Users
                                </Typography>
                            </Paper> : <div></div>}
                        {searchUsers.map(([name, uid], index) => {
                            return (<SearchItem key={index} type={0} name={name} id={uid} username={username} joined={addMap[uid]}></SearchItem>)
                        })}
                        {searchGroups.length > 0 ? 
                            <Paper variant="outlined" style={{ "borderRadius": 0 }}>
                                <Typography>
                                Groups
                                </Typography>
                            </Paper> : <div></div>}
                        {searchGroups.map(([groupName, groupId], index) => {
                            return (<SearchItem key={index} type={1} name={groupName} id={groupId} username={username} joined={joinMap[groupId]}></SearchItem>)
                        })}
                    </Grid>
                </div>
            </div>
            <Post style={{zIndex: '1'}} uid={uid} username={username}>

            </Post>
        </div>
    );
};

export default SearchPage;