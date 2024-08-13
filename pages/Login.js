import { withStyles, makeStyles, Box, Toolbar, AppBar, Button, Divider, TextField, Typography, Switch } from "@material-ui/core";
import { grey } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../component/Header"
import "../style.css";
import axios from "axios";
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
  }));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(grey[900]),
        backgroundColor: grey[900],
        '&:hover': {
            backgroundColor: grey[700],
        },
    },
}))(Button);

async function UserLogin(email, password, setSigninFailed, navigate, setUser) {
    if (!email || !password) {
        setSigninFailed(true);
        return;
    }
    try {
        const {data} = await axios.post('/login', {
            email,
            password,
        });
        setUser(data);
        navigate('/main');
    } catch (e) {
        console.log(e)
        setSigninFailed(true);
    } 
}

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [signinFailed, setSigninFailed] = useState(false);
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState((location.state === null) ? false : location.state.isSignup);
    const navis = [() => {navigate('/')}, () => {navigate('/signup')}]
    const {setUser} = useContext(UserContext);
    window.history.replaceState({}, document.title);
    return (
        <div>
            <Header isLogin={false} classes={classes} title={"Chat Room"} selected={"Sign In"} navis={navis} login={false}></Header>
            <div className="login">
                <Typography variant="h6" style={{marginLeft:"10px"}}>
                        {"Email"}
                </Typography>
                <Divider variant="middle" />
                <div className="inputField">
                    <TextField 
                        label="Email"
                        variant="outlined"
                        size="small"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <Typography variant="h6" style={{marginLeft:"10px"}}>
                    {"Password"}
                </Typography>
                <Divider variant="middle" />
                <div className="inputField">
                    <TextField 
                        label="Password"
                        variant="outlined"
                        size="small"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div className="inputField">
                    <ColorButton 
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={() => {
                            UserLogin(email, password, setSigninFailed, navigate, setUser);
                        }}
                    >
                        Sign In
                    </ColorButton>
                </div>
                {isSignup ? 
                <div className="inputField">
                    <Alert onClose={() => {setIsSignup(false)}}>You have successfully signed up!</Alert>
                </div>
                : <div></div>}
                {signinFailed ? 
                <div className="inputField">
                    <Alert severity="error" onClose={() => {setSigninFailed(false)}}>Failed to Sign in!</Alert>
                </div>
                : <div></div>}
            </div>
        </div>
    );
};

export default LoginPage;