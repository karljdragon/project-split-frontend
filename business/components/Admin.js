import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';


// styling
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      margin: theme.spacing(1)
    },

    formControl:{
        minWidth: 40,
    },

    container: {
      maxHeight: '100%',
    },
  }));
//URL declaration
const URL = 'http://localhost:9002/internal/';


// Return function
const Admin = (props) => {

  //set states
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [pulledData, setPulledData] = useState(false);
    const [assign, setAssign] = useState('');

    // call on render
    useEffect(async () => {
      var data = await getUACList(URL);
      setPulledData(data);
    }, []);

    const classes = useStyles();
// API Calls
    async function getUACList(url, data){
      let getListURL = url + 'getuaclist';
      let formData = new FormData();
      formData.append('token', props.token);
  
      let response = await fetch(getListURL, {
          method: 'POST',
          body: formData
      });
      let result = await response.json();
      if (result.error){
          alert(result.error);
      } else {
          let acl = result.message;
          return(acl);
      };
    };

    async function updateUAC(url, data) { 
      let updateURL = url + 'updateuac';
      let formData = new FormData();
      formData.append('email', data.email);
      formData.append('permission_level', data.permission_level);
      formData.append('token', props.token);

      let response = await fetch(updateURL, {
          method: 'POST',
          body: formData
      });
      let result = await response.json();
      if (result.error){
        alert(result.error);
      } else{
          let updatedData = await getUACList(url);
          setPulledData(updatedData);
          alert('Access for ' + data.email + ' has been updated to ' + data.permission_level);
          setEmail('');
          setAssign('');
      };
  };

  //handlers
    const handleChange = (event) => {
        setAssign(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

       async function handleAcceptClose(selectedEmail, selectedPermission) {
        let data = {
          email: selectedEmail,
          permission_level: selectedPermission
        };
        await updateUAC(URL, data);
        setOpen(false);
      };

      //display ACL
      function displayResult(acl){
        if (pulledData){
          return (AdminAccess(acl));
        } else {
          return(<></>);
        };
    };
    
    // Admin Access control JSX
      function AdminAccess(acl) {
        return (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left"><Box fontWeight='fontWeightBold'>Email</Box></TableCell>
                  <TableCell align="right"><Box fontWeight='fontWeightBold'>Permission Level</Box></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acl.map((row) => {
                  return(
                  <TableRow hover role="checkbox" key={row.name} onClick={()=>setEmail(row[0])}>
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </TableContainer>
        );
      };

    return (
        <>
        <Typography component="h1" variant="h5" align='left'>
                Administrator Settings
            </Typography>
            <br/>
        <Paper>
        <Grid container spacing={3}>
                <Grid item xs={12} sm={1}></Grid>   
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="SearchEmail"
                        value={email}

                        name="SearchEmail"
                        label="Input staff's email to update"
                        fullWidth
                        autoComplete="email"
                        onChange={e => {
                            const val = e.target.value;
                            setEmail(val);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={5}></Grid>
                <br/>
                <Grid item xs={12} sm={1}></Grid>
                <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="Assign">Select Assignee</InputLabel>
                    <Select 
                        labelID="Assign"
                        ID = "Assign"
                        value = {assign}
                        onChange={handleChange}
                    >
                    <MenuItem value={"generate"}>Generate</MenuItem>
                    <MenuItem value={"read"}>Read</MenuItem>
                    <MenuItem value={"read + approve"}>Read & Approve</MenuItem>
                    <MenuItem value={0}>Remove Access</MenuItem>
                    </Select>
                    <FormHelperText>Select Permission to Assign</FormHelperText>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}></Grid>
                <br/>
                <Grid item xs={12} sm={1}></Grid>
                <Grid item xs={12} sm={2}>
                <div>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                  Submit
                </Button>
                <Dialog
                  open={open}
                  onClose={()=>handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Update assignee permission level?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Email: <i>{email}</i><br></br>
                      Permission level: <i>{assign}</i>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={()=>setOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={()=>handleAcceptClose(email, assign)} color="secondary" autoFocus>
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
                </Grid>
            </Grid>
            <br/>
        </Paper>
      <br/>
            {displayResult(pulledData)}
        </>

    );
};


export default Admin;
