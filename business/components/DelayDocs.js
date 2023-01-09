import React, {useEffect, useState, prevState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

//URL
const url = "http://localhost:9000/internal/";

//Styling
const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: '100%',
    },
});

//Return Function

const DelayDocs = (props) => {


    //Define Constants

    const classes = useStyles();

    const [checkBoxStatus, setCheckBoxStatus] = useState({
        IC_Front: false,
        IC_Back: false,
        Proof_For_Extension: false,
    });

    const [pulledData, setPulledData] = useState(null);

    const [pulledJustificationData, setPulledJustificationData] = useState(null);

    const [rejectedDocsArr, setRejectedDocsArr] = useState(null);

    const [resubmitState, setResubmitState] = useState(false);
    const [approvalState, setApprovalState] = useState(false);
    const [rejectionState, setRejectionState] = useState(false);

    const [reason, setReason] = useState('');

    const [submitError, setSubmitError] = useState([]);

    const [submitState, setSubmitState] = useState(false);

    const [extensionDate, setExtensionDate] = useState('');

    const info_id = props.infoID;

    //Called on initial render

    useEffect(async () => {
        var data = await getData(url, info_id);
        setPulledData(data);
        if (data.documents.length > 0) {
            var justificationData = await getJustificationData(url, info_id);
            setPulledJustificationData(justificationData)
        };
    }, []);
    

    // Set documents When API returns value
    var data = {documents:[]};
    if (pulledData) {
        data = (pulledData);
    };

    var justificationData = {};
    if (pulledData) {
        justificationData = (pulledJustificationData);
    };

    // API Call Functions

    async function getData(url, info_id_val) {
        let detailURL = url + 'getsubmissiondetails';
        let formData = new FormData();
        formData.append('info_id', info_id_val);
        formData.append('token', props.token);
    
        let response = await fetch(detailURL, {
            method: 'POST',
            body: formData
        });
        let result = await response.json();
        if (result.error){
            alert(result.error);
        } else {
            return result;
        };
    };

    async function getJustificationData(url, info_id_val) {
        let detailURL = url + 'getjustification';
        let formData = new FormData();
        formData.append('info_id', info_id_val);
        formData.append('token', props.token);

        let response = await fetch(detailURL, {
            method: 'POST',
            body: formData
        });
        let result = await response.json();
        if (result.error){
            alert(result.error);
        } else {
            return result;
        };
    };

    async function submitReason(data, url){
        let URL = url + 'rejectionreason';
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        formData.append('token', props.token);
        let QUERY = {
            method: 'POST',
            body: formData
        };
        let response = await fetch(URL, QUERY);
        let result = await response.json();
        let error = '';
        if (result.error){
            error = result.error;
            setSubmitError(prevState=>({
                submitError: [...prevState.submitError, error]
            }));
        };
    };

    async function submitExtension(data, url){
        let URL = url + 'paymentdateextension';
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        formData.append('token', props.token);
        let QUERY = {
            method: 'POST',
            body: formData
        };
        let response = await fetch(URL, QUERY);
        let result = await response.json();
        let error = '';
        if (result.error){
            error = result.error;
            var arr = submitError;
            arr.push(error);
            setSubmitError(arr);
        };
    };

    async function submitDecision(data, url){
        let URL = url + 'appdecision';
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        formData.append('token', props.token);
        let QUERY = {
            method: 'POST',
            body: formData
        };
        let response = await fetch(URL, QUERY);
        let result = await response.json();
        let error = '';
        if (result.error){
            error = result.error;
            var arr = submitError;
            arr.push(error);
            setSubmitError(arr);
        };
    };

    async function getURL(url, email, document_type) {
        let documentURL = url + 'getdocumentlink';
        let formData = new FormData();
        formData.append('email', email);
        formData.append('filetype', document_type);
        formData.append('token', props.token);
    
        let response = await fetch(documentURL, {
            method: 'POST',
            body: formData
        });
        
        let result = await response.json();
        if (result.error){
            alert(result.error);
            return false;
        } else {
            let documentpath = result.url;
            return documentpath;
        };
    };

    // Open documents

    async function openDocument(email, document_type, document_path, url){
        let path = await getURL(url, email, document_type);
        let extension = document_path.split('.');
        extension = extension[extension.length - 1];
        
        if(path){
            window.open('http://localhost:3002/ext=' + extension + 'link=' + path);
        };
    };

    // HELPER FUNCTIONS

    // Checks for item in array
    function foundIn(item ,array){
        let outcome = false;
        array.forEach(element => {
            if (element == item){
                outcome = true;
            };
        });
        return outcome;
    };
    // Returns a list of documents from document array
    function documentList(documents){
        let return_arr = [];
        if(documents){
        documents.map((document) => {
            let val = document.document_type;
            return_arr.push(val);
        })};
        return return_arr;
    };
    // Handles Button Status
    function handleResubmitButton(documents){
        let combinedStatus = false;
        if(documents){
            combinedStatus = true;
            let docArr = documentList(documents);
            if(foundIn("IC_Front", docArr)){
                if(!checkBoxStatus.IC_Front){
                    combinedStatus = false;
                };
            };
            if(foundIn("IC_Back", docArr)){
                if(!checkBoxStatus.IC_Back){
                    combinedStatus = false;
                };
            };
            if(foundIn("Proof_For_Extension", docArr)){
                if(!checkBoxStatus.Proof_For_Extension){
                    combinedStatus = false;
                };
            };
        };
        return combinedStatus;
    };
    // Handle Request Resubmission Click
    function handleResubmitClick(documents){
        let rejected_arr = [];
        if(documents){
            let docArr = documentList(documents);
            if(foundIn("IC_Front", docArr)){
                if(!checkBoxStatus.IC_Front){
                    rejected_arr.push('IC_Front');
                };
            };
            if(foundIn("IC_Back", docArr)){
                if(!checkBoxStatus.IC_Back){
                    rejected_arr.push('IC_Back');
                };
            };
            if(foundIn("Proof_For_Extension", docArr)){
                if(!checkBoxStatus.Proof_For_Extension){
                    rejected_arr.push('Proof_For_Extension');
                };
            };
        };
        
        setRejectedDocsArr(rejected_arr);
        if(rejected_arr){
            setResubmitState(true);
        }
    };

    // Handle Rejection of Request
    function handleRejectionClick(){
        setRejectionState(true);
    };
    function handleApprovalClick(){
        setApprovalState(true);
    };

    // JSX FUNCTIONS

    // Return Customer Information
    function customerInformation(data){
        if(data){
        return(
            <Paper>
                    <Typography variant='body1'>
                        <Box fontWeight="fontWeightBold" m={1}>
                            Email:
                        </Box>
                    </Typography>
                    <Typography variant='body1'>
                        <Box m={1}>
                            {data.email}
                        </Box>
                    </Typography>
                    <br/>
                    <Typography variant='body1'>
                        <Box fontWeight="fontWeightBold" m={1}>
                            Country:
                        </Box>
                    </Typography>
                    <Typography variant='body1'>
                        <Box m={1}>
                            {data.country}
                        </Box>
                    </Typography>
                    <br />
                </Paper>
        )};
    };
    // Return Purchase Information
    function purchaseInformation(data){
        if(data){
        return(
            <Paper>
                <Typography variant='body1'>
                    <Box fontWeight="fontWeightBold" m={1}>
                        Merchant:
                    </Box>
                </Typography>
                <Typography variant='body1'>
                    <Box m={1}>
                        {data.merchant}
                    </Box>
                </Typography>
                <br/>
                <Typography variant='body1'>
                    <Box fontWeight="fontWeightBold" m={1}>
                        Order Number:
                    </Box>
                </Typography>
                <Typography variant='body1'>
                    <Box m={1}>
                        {data.order_number}
                    </Box>
                </Typography>
                <br />
            </Paper>
        )};
    };


// Return Justification Info
    function justificationInformation(data){
        if(data){
        return(
            <>
            <Typography variant='h6'>
                Request Information
            </Typography>
            <Paper>
                <Typography variant='body1'>
                    <Box fontWeight="fontWeightBold" m={1}>
                        Reason:
                    </Box>
                </Typography>
                <Typography variant='body1'>
                    <Box m={1}>
                        {data.reason}
                    </Box>
                </Typography>
                <br/>
                <Typography variant='body1'>
                    <Box fontWeight="fontWeightBold" m={1}>
                        Emergency Contact Information
                    </Box>
                </Typography>
                <Typography variant='body1'>
                    <Box m={1}>
                        <Grid container >
                            <Grid item xs={12} sm={4}>
                                <Box fontWeight="fontWeightBold">Name:</Box>
                                {data.emname} 
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box fontWeight="fontWeightBold">Relationship:</Box>
                                {data.emrel}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box fontWeight="fontWeightBold">Phone Number:</Box>
                                {data.emnum}
                            </Grid>
                        </Grid>
                        <br /><br />
                        <Box fontWeight="fontWeightBold">Requested Date:</Box>
                        {data.extdate.slice(0,-13)}
                    </Box>
                </Typography>
                <br />
            </Paper>
            </>
        )};
    };

    // Determine Display Rows
    function displayAllRows(documents){
        let display_arr = [];
        if (documents){
        documents.map((document)=>{
            if (document.document_type === "IC_Front"){
                display_arr.push(displayFrontICRow(document.document_path));
            };
            if (document.document_type === "IC_Back"){
                display_arr.push(displayBackICRow(document.document_path));
            };
            if (document.document_type === "Proof_For_Extension"){
                display_arr.push(displayReasonRow(document.document_path));
            };
        })};
        return display_arr;
    }

    // Return JSX for document rows
    function displayFrontICRow(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    IC Front
                </TableCell>
                <TableCell>
                    <Checkbox

                        onClick={()=>{
                            let val = checkBoxStatus.IC_Front;
                            val = !val;
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, IC_Front: val};
                                });
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'IC_Front', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )};
    function displayBackICRow(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    IC Back
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.IC_Back;
                            val = !val;
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, IC_Back: val};
                                });
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'IC_Back', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )};
    function displayReasonRow(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    Proof For Extension
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.Proof_For_Extension;
                            val = !val;
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, Proof_For_Extension: val};
                                });
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'Proof_For_Extension', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )};

    //Display documents
    
    function displayDocumentTable(documents){
        if (documents){
        return (
            <>
            <Typography component="h1" variant="h6" color="inherit" gutterBottom>
                Submitted Documents:
            </Typography>
            <Paper>
                
                <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Document Type</TableCell>
                            <TableCell>Approve Document?</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody>
                    {displayAllRows(documents)}
                </TableBody>
                </Table>
            </TableContainer>
          </Paper>
          </>
        )};
    };

    // Disply resubmission confirmation page
    function displayResubmitConfirmation(documents, info_id, rejectReason, email){
        let data = {
            'info_id': info_id,
            'approval': 'true',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_For_Extension': 'true',
        };
        documents.map((document)=>{
            data[document] = 'false';
        });

        let reasonData = {
            'info_id': info_id,
            'reason': rejectReason
        };

        return(
            <div>
                <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                <Paper>
                    <Typography variant='body1'>
                        <Box fontWeight="fontWeightBold" m={1}>
                            You are REJECTING and requesting a RESUBMISSION of the following document(s) from {email}:
                        </Box>
                    </Typography>
                        <Box fontWeight='fontWeightLight' m={3}>
                        {documents.map((item) =>
                            <Typography variant='body2' nowrap>
                                <Box fontWeight='fontWeightLight' m={1}>
                                    {item}
                                </ Box>
                            </Typography>
                        )}
                        </Box>
                    <br/>
                </Paper>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography>
                        Input response for Document Rejection:
                    </Typography>
                    <TextField 
                        variant="filled"
                        id='emailBody'
                        value={reason}
                        onChange={e => {
                            const val = e.target.value;
                            setReason(val);
                        }}
                        multiline
                        fullWidth
                        >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth onClick={()=>{
                        setResubmitState(false);
                        setRejectedDocsArr(null);
                        setReason('');
                        setCheckBoxStatus({
                            IC_Front: false,
                            IC_Back: false,
                            Proof_For_Extension: false,
                        });
                        }}>
                        Cancel
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth
                    onClick={()=>{
                        handleSubmitWithReason(data, reasonData);
                    }}
                    >
                        Submit
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                </Grid>
            </div>
    )};

    //Handles submit with reason

    async function handleSubmitWithReason(data, reasonData){
        if(reason){
            await submitDecision(data, url);
            await submitReason(reasonData, url);
            if(submitError.length > 0){
                setSubmitError([]);
            }else{
                setSubmitState(true);
            }
        } else {
            alert('You have left the reason field empty');
        };
    };

    async function handleSubmitWithoutReason(data, dateData){
        if(extensionDate){
            await submitExtension(dateData, url);
            await submitDecision(data, url);
            if(submitError.length > 0){
                alert(submitError);
                setSubmitError([]);
            }else{
                setSubmitState(true);
            };
        } else{
            alert('You have not selected an extension date');
        };
    };

    // Display PE Rejection confirmation page

    function displayRejectionConfirmation(info_id, email, customerReason){
        let data = {
            'info_id': info_id,
            'approval': 'true',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_For_Extension': 'true',
        };

        let reasonData = {
            'info_id': info_id,
            'reason': reason
        };
        return(
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <Paper>
                            <Typography variant='body1'>
                                <Box fontWeight="fontWeightBold" m={1}>
                                    You are REJECTING the following PE request:
                                </Box>
                            </Typography>
                                <Box m={3}>
                                    <Typography variant='body2' nowrap>
                                        <Box fontWeight='fontWeightBold'>
                                            Email:
                                        </Box>
                                        &nbsp;&nbsp;{email}:
                                        <br/><br/>
                                        <Box fontWeight='fontWeightBold'>
                                            Reason:
                                        </Box>
                                        &nbsp;&nbsp;{customerReason}
                                        
                                    </Typography>
                                </Box>
                            <br/>
                        </Paper>
                    </Grid>
                <Grid item xs={12} sm={12}>
                    <Typography>
                        Input rejection email content:
                    </Typography>
                    <TextField 
                        variant="filled"
                        id='emailBody'
                        value={reason}
                        onChange={e => {
                            const val = e.target.value;
                            setReason(val);
                        }}
                        multiline
                        fullWidth
                        >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth onClick={()=>{
                        setRejectionState(false);
                        setRejectedDocsArr(null);
                        setReason('');
                        setCheckBoxStatus({
                            IC_Front: false,
                            IC_Back: false,
                            Proof_For_Extension: false,
                        });
                        }}>
                        Cancel
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth
                    onClick={()=>{
                        handleSubmitWithReason(data, reasonData)
                    }}
                    >
                        Submit
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                </Grid>
            </div>
        );
    };

    //Display PR approval confirmation

    function displayApprovalConfirmation(info_id, email, customerReason){
        let data = {
            'info_id': info_id,
            'approval': 'true',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_For_Extension': 'true',
        };
        let dateData = {
            'info_id': info_id,
            'date': extensionDate
        };
        return(
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <Paper>
                            <Typography variant='body1'>
                                <Box fontWeight="fontWeightBold" m={1}>
                                    You are APPROVING the following PE request:
                                </Box>
                            </Typography>
                                <Box m={3}>
                                    <Typography variant='body2' nowrap>
                                        <Box fontWeight='fontWeightBold'>
                                            Email:
                                        </Box>
                                        &nbsp;&nbsp;{email}:
                                        <br/><br/>
                                        <Box fontWeight='fontWeightBold'>
                                            Reason:
                                        </Box>
                                        &nbsp;&nbsp;{customerReason}
                                    </Typography>
                                </Box>
                            <br/>
                        </Paper>
                    </Grid>
                <Grid item xs={12} sm={12}>
                <TextField 
                    id="date"
                    type="date"
                    minDate="today"
                    value={extensionDate}
                    onChange={e => {
                        const val = e.target.value;
                        setExtensionDate(val);
                    }}
            />
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth onClick={()=>{
                        setApprovalState(false);
                        setRejectedDocsArr(null);
                        setReason('');
                        setCheckBoxStatus({
                            IC_Front: false,
                            IC_Back: false,
                            Proof_For_Extension: false,
                        });
                        }}>
                        Cancel
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth
                    onClick={()=>{
                        handleSubmitWithoutReason(data, dateData);
                    }}
                    >
                        Submit
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                </Grid>
            </div>
        );
    };

    // Success Display

    function displaySuccessfulSubmission(){
        return(
            <Typography variant='h3'>
                Submission Successful!
            </Typography>
        );
    };

    // Display determineing function
    function confirmDisplay(data, rejectedDocsArr,){
        if (data.documents.length > 0){
        if(!resubmitState && !approvalState && !rejectionState){
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} style={{height: '100%'}}>
                        <Grid style={{height: '100%'}}>
                        <Typography variant='h6' gutterbottom>
                                Customer Information
                        </Typography>
                        {customerInformation(data)}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{height: "100%"}} >
                        <Grid style={{height: '100%'}}>
                        <Typography variant='h6' gutterbottom>
                            Purchase Information
                        </Typography>
                        {purchaseInformation(data)}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {justificationInformation(justificationData)}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button disabled={handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleResubmitClick(data.documents)}>
                            Request Resubmission
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button disabled={!handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleApprovalClick()}>
                            Approve PE Request
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button disabled={!handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleRejectionClick()}>
                            Reject PE Request
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {displayDocumentTable(data.documents)}
                    </Grid>
                </ Grid>
            )
            } else if (submitState){
                return(displaySuccessfulSubmission());
            } else if (resubmitState){
                return(displayResubmitConfirmation(rejectedDocsArr, data.info_id, reason, data.email));
            } else if (approvalState){
                return(displayApprovalConfirmation(data.info_id, data.email, justificationData.reason));
            } else if (rejectionState){
                return(displayRejectionConfirmation(data.info_id, data.email, justificationData.reason));
            };
        }else{
            return(
                <Typography variant='h5'>
                    There are no files for verification
                </Typography>
            );
        };
    };

    return (
        confirmDisplay(data, rejectedDocsArr)
    );
};

export default DelayDocs;
