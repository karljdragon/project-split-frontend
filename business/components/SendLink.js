import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';

const SendLink = () => {


    return (
        <>
        <Typography component="h1" variant="h5" align='left'>
                Send One-Time Link
        </Typography>
        <br/>
        <Paper>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    id="SearchEmail"
                    name="SearchEmail"
                    label="Input customer's email to search"
                    fullWidth
                    autoComplete="email"
                    onChange={console.log('changed')}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button 
                variant="contained"
                colour="inherit"
                fullWidth
                onClick={console.log('clicked')}
                >
                    Search
                </Button>
            </Grid>
            </Grid>
            <br/>
        </ Paper>
        </>
    )
}

export default SendLink
