import React from 'react'
import Typography from '@material-ui/core/Typography'

const ErrorPage = (props) => {


    return (
        <>
            <br/>
            <Typography component="h1" variant="h5" align='center'>
                An unexpected error has occurred: {props.error}
            </Typography>
            <br/>
        </>
    )
}

export default ErrorPage
