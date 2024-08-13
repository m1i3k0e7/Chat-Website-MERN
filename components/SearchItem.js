import { Typography, makeStyles, Paper } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        '&:hover': {
            backgroundColor: 'rgb(240, 240, 240)'
        },
        borderRadius: 0,
    },
    icon: {
        float: 'right'
    }, 
    text: {
        [theme.breakpoints.down('md')]: {
            fontSize: '22px',
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '15px',
        },
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

const SearchItem = ({type, name, id, username, joined}) => {
    const classes = useStyles();
    const [isAdded, setIsAdded] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [uid, setUid] = useState('');

    return (
        <Paper elevation={0} className={classes.container}>
            <Typography variant="h4" className={classes.text}> {name} </Typography>
            <IconButton 
                        className={classes.icon} 
                        onClick={() => {
                            switch (type) {
                                case 0:
                                    
                                    break;
                                case 1:
                                    
                                    break;
                                default:
                                    console.log("wrong search type, add failed.");
                            }
                        }}
            >
                {((isJoined && type == 1) || (isAdded && type == 0)) ? <CheckIcon></CheckIcon> : <AddIcon></AddIcon>}
            </IconButton>
        </Paper>
    );
}

export default SearchItem;