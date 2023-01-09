// rafce to create component
import './App.css';
import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CEFailure from './components/CEFailure';
import Linearprogress from '@material-ui/core/Linearprogress';
import ErrorPage from "./components/ErrorPage";
import EmailDisplay from './components/EmailDisplay'
import PERequest from './components/PERequest';
import Resbmission from './components/Resubmission';
import Box from '@material-ui/core/Box';


//Returns JSX for copyright area
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
};


// Styling
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function App() {

  // get the otl from the URL string
  var url = window.location.href;
  var otl = url.split('/')[3];
  var otlAPI = 'http://localhost:5000/otlcheck/' + otl;

  var QUERY = {
    method: 'GET'
  };

// Function to get data from otl check
  const fetchOtlAPI = async () => {
    let  response = await fetch(otlAPI, QUERY);
    let dataPulled = await response.json();
    return dataPulled;
  };

  //set dataState
  const [dataState, setDataState] = useState({
    loaded: false,
    data: null,
  });
  
  //calls OTL check on first load
  useEffect(async () => {
    var dataPulled = await fetchOtlAPI();
    if (dataPulled){
      setDataState({loaded: true, data: dataPulled});
    };
  }, []);

  const classes = useStyles();

  //returns JSX of final display
  function FinalDisplay() {
    if(dataState.loaded) {
      if(dataState.data.error){
        return( <ErrorPage error={dataState.data.error} />);
      } else if (dataState.data.JWT) {
          return( 
            <> 
              <EmailDisplay email={dataState.data.email} />
              
              <PaperDisplay /> 

            </>);
        } else { // If otlcheck API is called, but data returned is empty what do i display
        return (<>  </>)
      };
    } else {
      return (<Linearprogress />)
    };
  };

  
  //determine which to display
  function PaperDisplay() {
    let data = dataState.data;
    // console.log(data)
    if (data.comment){
      return (<Resbmission otl={otl} JWT={data.JWT} type={data.type} email={data.email} missing_documents={data.missing_documents} comment={data.comment}/>);
    } else if (data.type == 'PE'){
      return (<PERequest otl={otl} JWT={data.JWT} type={data.type} email={data.email} missing_documents={data.missing_documents}/>);
    } else if(data.type == 'CE') {
      return (<CEFailure otl={otl} JWT={data.JWT} type={data.type} email={data.email} missing_documents={data.missing_documents}/>);
    };
  };

  //returns JSX 
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" bgcolor="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Pay With Split
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <FinalDisplay />
        <Box pt={4}>
            <Copyright />
        </Box>
      </main>
    </React.Fragment>
  );
};

export default App;
