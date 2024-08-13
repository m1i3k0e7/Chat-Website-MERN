import { Typography, makeStyles, Paper } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    container: {
        borderRadius: "5px",
        border: "2px solid rgb(240, 240, 240)",
        height: "100px",
        '&:hover': {
            backgroundColor: 'rgb(240, 240, 240)'
        },
    }, 
    name: {
        float: "left",
        padding: "10px",
        wordWrap: 'break-word',
        whiteSpace: 'normal',
    },
    time: {
        float: "right",
        padding: "10px",
        [theme.breakpoints.down('md')]: {
            fontSize: '12px',
            padding: '5px'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '7px',
            padding: '2px'
        },
        
    }, 
    newMessage: {
        color: "black"
    },
    oldMessage: {
        color: "rgb(140,140,140)",
        [theme.breakpoints.down('sm')]: {
            fontSize: '15px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
        },
    },
    text: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '15px',
        },
    }
  }));

const ContactItem = ({name, id, setContactInfo, isNew, type, friendId, time, content}) => {
    const classes = useStyles();
    const [uid, setUid] = useState('');
    
    return (
        <Paper 
            className={classes.container} 
            elevation={5} 
            onClick={() => {
                setContactInfo([name, id]);
            }}>
            <div className={classes.name}>
                <Typography variant="h4" className={classes.text}> {name} </Typography>
                <Typography variant="h6" className={isNew ? classes.newMessage : classes.oldMessage}> {content.length > 25 ? content.substring(0, 25) + '...' : content} </Typography>
            </div>
            <Typography variant="h6" className={classes.time}> {time.substring(11, 16)} </Typography>
        </Paper>
    );
}

export default ContactItem;