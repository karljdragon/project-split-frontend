import React, {useState, prevState} from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog'
import Radio from '@material-ui/core/Radio'

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: '100%',
    },
  });

const OneTimeLink = (props) => {

    const [email, setEmail] = useState('');

    const [submitState, setSubmitState] = useState(false);
    
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    }

    async function sendOTL(email, apptype) {
        let otlURL = 'http://localhost:9001/internal/'+ 'generate_new_submission'
        let formData = new FormData();
        formData.append('email', email)
        formData.append('apptype', apptype)
        formData.append('token', props.token)
    
        let response = await fetch(otlURL, {
            method: 'POST',
            body: formData
        })
        let result = await response.json();
        if (result.error){
            alert(result.error)
        } else {
            setSubmitState(true)
        }
    }

    function successDisplay(submitState){
        if(submitState){
            return(
                <Paper>
                    <br/>
                    <Grid container alignContent='center'>
                    <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" align='center'>
                                You have successfully sent the OTL to {email} for a {selectedValue} request!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={5}></Grid>
                        <Grid item xs={12} sm={2}>
                            <Button onClick={()=>{
                                setEmail('')
                                setSelectedValue('')
                                setSubmitState(false)
                                }}
                                variant='contained'
                                fullWidth
                            >
                                Back
                            </Button>
                        </Grid>
                    <Grid item xs={12} sm={5}></Grid>
                    </Grid>
                    <br/>
                </Paper>
            )
        }else{
            return(
                <>
                    <Typography component="h1" variant="h5" align='left'>
                        Send One-Time Link
                    </Typography>
                    <br/>
                    <Paper>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={1}>
                            </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="SearchEmail"
                                value={email}

                                name="SearchEmail"
                                label="Customer Email"
                                fullWidth
                                autoComplete="email"
                                onChange={e => {
                                    const val = e.target.value;
                                    setEmail(val);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={1} alignContent='center'>
                            <Radio
                                checked={selectedValue === 'CE'}
                                onChange={handleChange}
                                value='CE'
                                name='CE'
                                />
                                <Typography variant='body1'>
                                CE Failure
                                </Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}></Grid>
                        <Grid item xs={12} sm={1}>
                            <Radio
                                checked={selectedValue === 'PE'}
                                onChange={handleChange}
                                value='PE'
                                name='PE'
                                />
                                <Typography variant='body1' >
                                Payment Extenison
                                </Typography>
                        </Grid>
                        <Grid item xs={12} sm={1}></Grid>
                        <Grid item xs={12} sm={2}>
                            <Button 
                            variant="contained"
                            colour="inherit"
                            fullWidth
                            onClick={()=>sendOTL(email, selectedValue)}
                            disabled={!email}
                            >
                                Send OTL
                            </Button>
                        </Grid>
                        <Grid item xs={12} s={1}></Grid>
                    </Grid>
                    <br/>
                    </Paper>
                    <br/>
                </>
            )
        }
    }

    return (
        successDisplay(submitState)
    )   
}

export default OneTimeLink
