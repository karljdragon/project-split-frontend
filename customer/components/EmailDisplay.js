import React from 'react';
import Typography from "@material-ui/core/Typography";


//returns email display
const EmailDisplay = (props) => {
    return (
        <>
          <br/>
          <Typography component="h1" variant="h5">
            Welcome {props.email}!
          </Typography>
          <br/>
        </>
    );
};

export default EmailDisplay;
