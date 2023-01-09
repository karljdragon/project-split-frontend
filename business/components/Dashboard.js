import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import LinkIcon from '@material-ui/icons/Link';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import BlockIcon from '@material-ui/icons/Block';
import Welcome from './Welcome';
import Button from '@material-ui/core/Button'
import Retrieve from './Retrieve'
import SendLink from './SendLink'
import Verification from './Verification'
import OneTimeLink from './OneTimeLink';
import Delay from './Delay'
import InvalidateOTL from './InvalidateOTL'
import Admin from './Admin'

// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        {new Date().getFullYear()}
        {' '}
        <Link color="inherit" href="https://paywithsplit.co/">
          Pay With Split Pte Ltd.
        </Link>{' '}
        
      </Typography>
    );
  }

const drawerWidth = 300;

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
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
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
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
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

export default function Dashboard(props) {
  const classes = useStyles();

  const [currentState, setCurrentState] = useState('')
  const [userInfo, setUserInfo] = useState(props.info)

  function paperDisplay(){

    if(currentState === 'Retrieve') {
      return(<Retrieve token={userInfo.token}/>)
    } else if (currentState === 'SendLink') {
      return(<SendLink token={userInfo.token}/>)
    } else if (currentState === 'Verification') {
      return(<Verification token={userInfo.token}/>)
    } else if (currentState === 'Admin'){
      return (<Admin token={userInfo.token}/>)
    } else if (currentState === 'Delay') {
      return(<Delay token={userInfo.token}/>)
    } else if (currentState === 'OneTimeLink') {
      return(<OneTimeLink token={userInfo.token}/>)
    } else if(currentState === 'Invalidate') {
      return(<InvalidateOTL token={userInfo.token}/>)
    }else {
      return (<Welcome />)
    }
  }


  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function readListItem(){
    return(
      <ListItem button onClick={()=>setCurrentState('Retrieve')}> 
        <ListItemIcon>
          <FindInPageOutlinedIcon />
        </ListItemIcon>
        <ListItemText 
          disableTypography
          primary= {<Typography variant='subtitle2'>Retrieve Documents</Typography>} />
      </ListItem>
    )
  }

  function writeListItem(){
    return(
      <>
        <ListItem button onClick={()=>setCurrentState('Verification')}>
            <ListItemIcon>
              <CheckBoxOutlinedIcon />
            </ListItemIcon>
            <ListItemText 
              disableTypography
              primary= {<Typography variant='subtitle2'>CE Failure Document Verification</Typography>} 
              />
          </ListItem>
          <ListItem button onClick={()=>setCurrentState('Delay')}>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText 
              disableTypography
              primary= {<Typography variant='subtitle2'>Payment Delay Request</Typography>} 
              />
          </ListItem>
      </>
    )
  }

  function otlListItems(){
    return(
      <>
        <ListItem button onClick={()=>setCurrentState('OneTimeLink')}>
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText 
            disableTypography
            primary= {<Typography variant='subtitle2'>Generate OTL</Typography>} />
        </ListItem>
        <ListItem button onClick={()=>setCurrentState('Invalidate')}>
          <ListItemIcon>
            <BlockIcon />
          </ListItemIcon>
          <ListItemText 
            disableTypography
            primary= {<Typography variant='subtitle2'>Invalidate OTL</Typography>} />
        </ListItem>
      </>
    )
  }

  function adminListItem(){
    return(
      <ListItem button onClick={()=>setCurrentState('Admin')}>
        <ListItemIcon>
          <AssignmentIndOutlinedIcon />
        </ListItemIcon>
        <ListItemText 
          disableTypography
          primary= {<Typography variant='subtitle2'>Administrator Settings</Typography>} />
      </ListItem>
    )
  }
  
  function loadDrawer(info){
    if (info){
      return(
        <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper),
        }}
      >
          <br/><br/><br/>
        <List>
          {info.permission_level !== "generate" && readListItem()}
          {info.permission_level !== "generate" && userInfo.permission_level !== "read" ? writeListItem():<></>}
          {otlListItems()}
          {info.permission_level === "superadmin" && adminListItem()}
        </List>
      </Drawer>
      )
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h5" color="inherit" noWrap className={classes.title}>
            Split Document Center
          </Typography>
          <img src={props.info.image} className={classes.img} height='50vh'/>
          <Typography component='body2' className={classes.userInfo}>
            {props.info.email}
            <br/>
            {props.info.name}
          </Typography>

          <Button variant="contained" onClick={()=>window.location.reload()}>
            <Typography variant='body2'>
              Logout
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      {loadDrawer(userInfo)}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={12}>
              {paperDisplay()}
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}