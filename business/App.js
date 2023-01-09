import React, {useState} from 'react';
import Dashboard from './components/Dashboard';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GoogleLogin } from 'react-google-login';
import { EmailTwoTone } from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  userInfo: {
    align: 'right',
    marginRight: 10
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 700,
    width: '100%'
  },
  img: {
    borderRadius: '50%',
    marginRight: 10,
  }
}));

function App() {

  const classes = useStyles();

  const [loginState, setLoginState] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  async function responseGoogle(response){

      let token = response.tokenId
      let name = response.profileObj.givenName
      let email = response.profileObj.email
      let image = response.profileObj.imageUrl
      let permission_level = await getData(token)
      
      if(permission_level){
        setUserInfo({
          name: name,
          email: email,
          image: image,
          token: token,
          permission_level: permission_level,
        })
        setLoginState(true)
      }
  }

  var google_button = 
    <GoogleLogin
      clientId="73862413462-ffk47jokm1tifafpuevraitlq6pfprv4.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />

  async function getData(token) {
    let tokenUrl = 'http://localhost:9002/internal/login'
    let formData = new FormData();
    formData.append('token', token)

    let response = await fetch(tokenUrl, {
        method: 'POST',
        body: formData
    })
    let result = await response.json();
    if (result.error){
        alert('Unauthorised Email Address')
    } else if(result.permission){
        return(result.permission)
    }
  }

  function loginPage(){
    return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
            Split Document Center
          </Typography>
          {google_button}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant='h5' align='center'>
          Welcome to Split Document Center!
        </Typography>
        <Typography variant='body1' align='center'>
          Login using your authenticated Google account
        </Typography>
      <Box pt={4}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        {new Date().getFullYear()}
        {' '}
        <Link color="inherit" href="https://paywithsplit.co/">
          Pay With Split Pte Ltd.
        </Link>{' '}
      </Typography>
      </ Box>
      </ Container>
      </main>
    </div>
    );
  }

  function displayDashboard(loginState){
    if(loginState){
      return (
        <Dashboard info={userInfo} />
      );
    }else{
      return(
      loginPage()
      );
    }
  }
 

  return(
    displayDashboard(loginState)
  )
}

export default App;
