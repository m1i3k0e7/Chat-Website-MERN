import { DialogContent, DialogActions, withStyles, makeStyles, Button,
         Typography, Divider, Dialog, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../component/Header"
import "../style.css";

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
    profileField: {
        position: 'fixed',
        width: '50vw',
        height: "50vh",
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    infoField: {
        paddingLeft: "20px",
        wordWrap: 'break-word'
    },
    info: {
        fontSize: "22px"
    },
    infoTitle: {
        fontSize: "13px",
    }, 
    textArea: {
        width: '100%',
    }
  }));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(grey[900]),
        backgroundColor: grey[900],
        '&:hover': {
            backgroundColor: grey[700],
        },
        float: 'right',
        margin: '10px',
        width: '45px'
    },
}))(Button);


const ProfilePage = () => {
    const navigate = useNavigate();
    const navis = [() => {navigate('/search')}, () => { localStorage.setItem("uidContext", uid); navigate('/profile'); }, () => {navigate('/main')}]
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isSelf, setIsSelf] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [about, setAbout] = useState('');
    const [edit, setEdit] = useState('');
    const [uid, setUid] = useState('');

    return (
        <div style={{flexDirection: 'column'}}>
            <Header isLogin={true} classes={classes} title={"Chat Room"} selected={"Profile"} navis={navis} login={true}></Header>
            <Dialog open={isOpen} onClose={() => { setIsOpen(false); }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To edit to your biography, please enter your information here.
                </DialogContentText>
                <TextField 
                            aria-label="minimum height" 
                            multiline
                            variant="outlined"
                            minRows={6} 
                            className={classes.textArea}
                            value={edit}
                            onChange={(e) => {
                                if(e.target.value.length <= 300) {
                                    setEdit(e.target.value);
                                }
                            }}
                />
                <div style={{float: 'right'}}>{edit.length} / 300</div>
                </DialogContent>
                <DialogActions>
                <ColorButton onClick={() => { setIsOpen(false); setEdit(about); }} color="primary">
                    Cancel
                </ColorButton>
                <ColorButton onClick={() => {
                                if(about) {
                                    
                                    setIsOpen(false);
                                    setAbout(edit);
                                }
                            }} 
                             color="primary"
                >
                    Submit
                </ColorButton>
                </DialogActions>
            </Dialog>
            <div className={classes.profileField}>
                <div className={classes.infoField}>
                    <Typography variant="overline" display="inline" className={classes.infoTitle}>
                        Username:
                    </Typography>
                    <Typography variant="body1" display="block" gutterBottom className={classes.info}>
                        {username}
                    </Typography>
                </div>
                <Divider variant="middle" />
                <div className={classes.infoField}>
                    <Typography variant="overline" display="block" className={classes.infoTitle}>
                        Email:
                    </Typography>
                    <Typography variant="body1" display="block" gutterBottom className={classes.info}>
                        {email}
                    </Typography>
                </div>
                <Divider variant="middle" />
                <div className={classes.infoField}>
                    <Typography variant="overline" display="block" className={classes.infoTitle}>
                        About:
                    </Typography>
                    <Typography variant="body1" display="block" gutterBottom className={classes.info}>
                        {about}
                    </Typography>
                </div>
                
                {isSelf ? <div><ColorButton 
                                onClick={() => { setIsOpen(true); }}
                          >
                            Edit
                        </ColorButton>
                        <ColorButton onClick={() => {
                            
                        }}>
                            Logout
                        </ColorButton></div>
                        : 
                        <div></div>
                }
                
            </div>
            
        </div>
    );
};

export default ProfilePage;