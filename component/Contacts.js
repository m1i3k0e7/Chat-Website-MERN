import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles,
    Button, TextField, Typography, Paper, Grid, Accordion, AccordionSummary, AccordionDetails, withStyles } from "@material-ui/core";
import ContactItem from "./ContactItem";
import Alert from '@material-ui/lab/Alert';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from "@material-ui/core/IconButton";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigation } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import axios from "axios";

const Chat = require('../api/models/Chat');

const useStyles = makeStyles((theme) => ({
    container: {
        border: "1px solid rgb(200, 200, 200)",
        height: "calc(100vh - 74px)",
        maxHeight: "calc(100vh - 74px)",
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
        overflowY: 'auto',
        width: '99%',
        margin: "0 auto"
    },
    accordion: {
        margin: 0,
        padding: 0,
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

const accordionStyles = {
    root: {
        border: "1px solid rgb(200, 200, 200)",
        overflow: 'auto',
      '&$expanded': {
        margin: '1px',
      },
    },
    expanded: {},
};
const CustomAccordion = withStyles(accordionStyles)(Accordion);

async function createNewGroup(groupName, setEmpty, setErrorMessage, setOpen, username, uid) {
    try {
        await axios.post('/createChat', {
            isGroupChat: true,
            chatName: groupName,
            users: [uid],
            lastText: username + " created the group",
            time: new Date(),
        });
        setOpen(false)
    } catch (e) {
        setEmpty(true);
        setErrorMessage(e);
    }
}

const Contacts = ({contactInfo, groupsList, setGroupsList, setContactInfo, friendsList, setFriendsList}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [empty, setEmpty] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {user} = useContext(UserContext);

    useEffect(() => {
        const {_id} = user;
        axios.post("/contacts", {
            _id,
        }).then(({data}) => {
            var glist = [], flist = []
            for (const chat of data.contacts) {
                if (chat.isGroupChat) {
                    glist.push([chat.chatName, chat.lastTextTime, chat._id, chat.lastText]);
                } else {
                    flist.push([chat.chatName, chat.lastTextTime, chat._id, chat.lastText]);
                }
            }
            glist.sort();
            flist.sort();
            setGroupsList(glist)
            setFriendsList(flist);
            if (flist.length > 0) {
                setContactInfo([flist[0][0], flist[0][2]]);
            } else if (glist.length > 0) {
                setContactInfo([glist[0][0], glist[0][2]]);
            }
        }).catch(e => {
            console.log(e);
        });
    }, []);

    return (
        <div className={classes.container}>
        <Typography variant="h3" className={classes.text}>
                    Contacts
                    <IconButton className={classes.icon} onClick={() => {setOpen(true)}}>
                        <AddCircleOutlineIcon 
                            style={{fontSize:"35px"}}>
                        </AddCircleOutlineIcon>
                    </IconButton>
        </Typography>
        <Paper elevation={5} style={{'height':'calc(100% - 70px)', 'maxHeight':'calc(100% - 70px)', 'overflow':'auto'}}>
            <CustomAccordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="h4">Friends</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordion}>
                    {/* <Grid className={classes.groupItemContainer}>
                            {friendsList.map(([friendName, chatId, isNew, friendId], index) => {
                                return (<ContactItem 
                                            key={index} 
                                            index={index} 
                                            name={friendName} 
                                            id={chatId} 
                                            setContactInfo={setContactInfo}
                                            isNew={isNew}
                                            type={1}
                                            friendId={friendId}
                                        ></ContactItem>);
                            })}
                    </Grid> */}
                </AccordionDetails>
            </CustomAccordion>
            <CustomAccordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                <Typography variant="h4">Groups</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordion}>
                    <Grid className={classes.groupItemContainer}>
                        {groupsList.map(([groupName, time, groupId, content], index) => {
                            return (<ContactItem
                                        key={index}
                                        name={groupName} 
                                        id={groupId}
                                        time={time}
                                        content={content}
                                        setContactInfo={setContactInfo}
                                        isNew={true}
                                        type={0}
                                    ></ContactItem>);
                        })}
                    </Grid>
                </AccordionDetails>
            </CustomAccordion>
        </Paper>
        <Dialog open={open} onClose={() => {setOpen(false);}} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create group</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To create a group, please enter group name here.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                fullWidth
                label="Group Name"
                style={{color: "black"}}
                value={groupName}
                onChange={(e) => {
                    if(e.target.value.length <= 15)
                        setGroupName(e.target.value);
                }}
            />
            <div style={{float:'right'}}>{groupName.length} / 15</div>
            {empty ? <Alert severity="error" onClose={() => {setEmpty(false)}}>{errorMessage}</Alert> : <></>}
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {setOpen(false);}} style={{color: "black"}}>
                Cancel
            </Button>
            <Button onClick={() => {    
                                        if (groupName !== "") {
                                            createNewGroup(groupName, setEmpty, setErrorMessage, setOpen, user.username, user._id);
                                        }
                                        setGroupName("");
                                    }} style={{color: "black"}}
            >
                Create
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default Contacts;