import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
const CommentDisplay = (props) => {

    return (
        <>
            <Typography variant='h6' gutterBottom>
                Reason for rejection:
            </Typography>
            <Box m={1}>
            <Typography variant='body1' gutterBottom>
                {props.comment}
            </Typography>
            </Box>
        </>
    );
};

export default CommentDisplay;
