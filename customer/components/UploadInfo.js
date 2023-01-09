import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


//returns upload information
const UploadInfo = () => {
    return (
            <Typography variant='caption'>
                <Box fontWeight="fontWeightLight" m={1}>
                    <br/>
                    Accepted File Types: .jpg, .jpeg, .png, .pdf 
                    <br/>
                    Maximum File Size: 2MB
                </Box>
            </Typography>
    );
};

export default UploadInfo;