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

const url = "http://localhost:9000/internal/";

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: '100%',
    },
});

const VerificationDocs = (props) => {

    const classes = useStyles();

    const [checkBoxStatus, setCheckBoxStatus] = useState({
        IC_Front: false,
        IC_Back: false,
        Proof_Of_Address: false,
        Payslip_Bank_Statement_1: false,
        Payslip_Bank_Statement_2: false,
    })

    const [pulledData, setPulledData] = useState(null)

    const [rejectedDocsArr, setRejectedDocsArr] = useState(null)

    const [resubmitState, setResubmitState] = useState(false)
    const [approvalState, setApprovalState] = useState(false)
    const [rejectionState, setRejectionState] = useState(false)

    const [reason, setReason] = useState('')

    const [submitError, setSubmitError] = useState([])

    const [submitState, setSubmitState] = useState(false)

    const info_id = props.infoID;

    useEffect(async () => {
        var data = await getData(url, info_id)
        setPulledData(data)
    }, [])
    
    var data = {documents:[]}
    if (pulledData) {
        data = (pulledData)
     }

    // API Call Functions

    async function submitReason(data, url){
        let URL = url + 'rejectionreason';
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        formData.append('token', props.token)

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
            }))

        };
    };

    async function submitDecision(data, url){
        let URL = url + 'appdecision';
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        formData.append('token', props.token)

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
            }))
        };
    };

    async function getData(url, info_id_val) {
        let detailURL = url + 'getsubmissiondetails'
        let formData = new FormData();
        formData.append('info_id', info_id_val)
        formData.append('token', props.token)
    
        let response = await fetch(detailURL, {
            method: 'POST',
            headers: {
                // await google SSO implementation ?
            },
            body: formData
        })
        let result = await response.json();
        if (result.error){
            alert(result.error)
        } else {
            return result
        }
    }

    async function getURL(url, email, document_type) {
        let documentURL = url + 'getdocumentlink'
        let formData = new FormData();
        formData.append('email', email)
        formData.append('filetype', document_type)
        formData.append('token', props.token)
    
        let response = await fetch(documentURL, {
            method: 'POST',
            body: formData
        })
        
        let result = await response.json();
        if (result.error){
            alert(result.error)
            return false
        } else {
            let documentpath = result.url
            return documentpath
        }
    }

    async function openDocument(email, document_type, document_path, url){
        let path = await getURL(url, email, document_type)
        let extension = document_path.split('.')
        extension = extension[extension.length - 1]
        
        if(path){
            window.open('http://localhost:3002/ext=' + extension + 'link=' + path)
        }
    }

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
        let return_arr = []
        if(documents){
        documents.map((document) => {
            let val = document.document_type
            return_arr.push(val)
        })};
        return return_arr
    }
    // Handles Button Status
    function handleResubmitButton(documents){
        let combinedStatus = false;
        if(documents){
            combinedStatus = true
            let docArr = documentList(documents);
            if(foundIn("IC_Front", docArr)){
                if(!checkBoxStatus.IC_Front){
                    combinedStatus = false
                }
            }
            if(foundIn("IC_Back", docArr)){
                if(!checkBoxStatus.IC_Back){
                    combinedStatus = false
                }
            }
            if(foundIn("Proof_Of_Address", docArr)){
                if(!checkBoxStatus.Proof_Of_Address){
                    combinedStatus = false
                }
            }
            if(foundIn("Payslip/Bank_Statement_1", docArr)){
                if(!checkBoxStatus.Payslip_Bank_Statement_1){
                    combinedStatus = false
                }
            }
            if(foundIn("Payslip/Bank_Statement_2", docArr)){
                if(!checkBoxStatus.Payslip_Bank_Statement_2){
                    combinedStatus = false
                }
            }
        }
        return combinedStatus
    }


    // Handle Request Resubmission Click
    function handleResubmitClick(documents){
        let rejected_arr = []
        if(documents){
            let docArr = documentList(documents);
            if(foundIn("IC_Front", docArr)){
                if(!checkBoxStatus.IC_Front){
                    rejected_arr.push('IC_Front')
                }
            }
            if(foundIn("IC_Back", docArr)){
                if(!checkBoxStatus.IC_Back){
                    rejected_arr.push('IC_Back')
                }
            }
            if(foundIn("Proof_Of_Address", docArr)){
                if(!checkBoxStatus.Proof_Of_Address){
                    rejected_arr.push('Proof_Of_Address')
                }
            }
            if(foundIn("Payslip/Bank_Statement_1", docArr)){
                if(!checkBoxStatus.Payslip_Bank_Statement_1){
                    rejected_arr.push('Payslip/Bank_Statement_1')
                }
            }
            if(foundIn("Payslip/Bank_Statement_2", docArr)){
                if(!checkBoxStatus.Payslip_Bank_Statement_2){
                    rejected_arr.push('Payslip/Bank_Statement_2')
                }
            }
        }
        
        setRejectedDocsArr(rejected_arr)
        if(rejected_arr){
            setResubmitState(true)
        }
    }

    function handleRejectionClick(){
        setRejectionState(true)
    }

    function handleApprovalClick(){
        setApprovalState(true)
    }

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
        )}
    }
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
        )}
    }

    // Determine Display Rows
    function displayAllRows(documents){
        let display_arr = []
        if (documents){
        documents.map((document)=>{
            if (document.document_type === "IC_Front"){
                display_arr.push(displayFrontICRow(document.document_path))
            }
            if (document.document_type === "IC_Back"){
                display_arr.push(displayBackICRow(document.document_path))
            }
            if (document.document_type === "Proof_Of_Address"){
                display_arr.push(displayAddressRow(document.document_path))
            }
            if (document.document_type === "Payslip/Bank_Statement_1"){
                display_arr.push(displayStatement1Row(document.document_path))
            }
            if (document.document_type === "Payslip/Bank_Statement_2"){
                display_arr.push(displayStatement2Row(document.document_path))
            }
        })}
        return display_arr
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
                            let val = checkBoxStatus.IC_Front
                            val = !val
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, IC_Front: val}
                                })
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
    )}
    function displayBackICRow(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    IC Back
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.IC_Back
                            val = !val
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, IC_Back: val}
                                })
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
    )}
    function displayAddressRow(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    Proof of Address
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.Proof_Of_Address
                            val = !val
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, Proof_Of_Address: val}
                                })
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'Proof_Of_Address', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )}
    function displayStatement1Row(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    Payslip / Bank Statement 1
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.Payslip_Bank_Statement_1
                            val = !val
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, Payslip_Bank_Statement_1: val}
                                })
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'Payslip/Bank_Statement_1', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )}
    function displayStatement2Row(path){
        return (
            <TableRow hover role="checkbox" >
                <TableCell>
                    Payslip / Bank Statement 2
                </TableCell>
                <TableCell>
                    <Checkbox
                        onClick={()=>{
                            let val = checkBoxStatus.Payslip_Bank_Statement_2
                            val = !val
                            setCheckBoxStatus(prevState=>{
                                    return {...prevState, Payslip_Bank_Statement_2: val}
                                })
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(props.email, 'Payslip/Bank_Statement_2', path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>
    )}


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
    }

    function displayResubmitConfirmation(documents, info_id, rejectReason, email){
        let data = {
            'info_id': info_id,
            'approval': 'true',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_Of_Address': 'true',
            'Payslip/Bank_Statement_1': 'true',
            'Payslip/Bank_Statement_2': 'true'
        }
        documents.map((document)=>{
            data[document] = 'false'
        })

        console.log(data)

        let reasonData = {
            'info_id': info_id,
            'reason': rejectReason
        }

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
                            setReason(val)
                        }}
                        multiline
                        fullWidth
                        >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth onClick={()=>{
                        setResubmitState(false)
                        setRejectedDocsArr(null)
                        setReason('')
                        setCheckBoxStatus({
                            IC_Front: false,
                            IC_Back: false,
                            Proof_Of_Address: false,
                            Payslip_Bank_Statement_1: false,
                            Payslip_Bank_Statement_2: false,
                        })
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
    )};

    async function handleSubmitWithReason(data, reasonData){
        if(reason){
            await submitDecision(data, url);
            console.log(reasonData)
            console.log(data)
            await submitReason(reasonData, url);
            if(submitError.length > 0){
                setSubmitError([])
            }else{
                setSubmitState(true)
            }
        } else {
            alert('You have left the reason field empty')
        }
    }

    async function handleSubmitWithoutReason(data){
        await submitDecision(data, url);
        if(submitError.length > 0){
            setSubmitError([])
        }else{
            setSubmitState(true)
        }
    }

    function displayRejectionConfirmation(info_id, email, rejectReason){
        let data = {
            'info_id': info_id,
            'approval': 'false',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_Of_Address': 'true',
            'Payslip/Bank_Statement_1': 'true',
            'Payslip/Bank_Statement_2': 'true'
        }

        let reasonData = {
            'info_id': info_id,
            'reason': rejectReason
        }
        return(
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                    <Paper>
                            <Typography variant='body1'>
                                <Box fontWeight="fontWeightBold" m={1}>
                                    You are REJECTING the following CE request:
                                </Box>
                            </Typography>
                                <Box m={3}>
                                    <Typography variant='body2' nowrap>
                                        <Box fontWeight='fontWeightBold'>
                                            Email:
                                        </Box>
                                        &nbsp;&nbsp;{email}
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
                            setReason(val)
                        }}
                        multiline
                        fullWidth
                        >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth onClick={()=>{
                        setRejectionState(false)
                        setRejectedDocsArr(null)
                        setReason('')
                        setCheckBoxStatus({
                            IC_Front: false,
                            IC_Back: false,
                            Proof_Of_Address: false,
                            Payslip_Bank_Statement_1: false,
                            Payslip_Bank_Statement_2: false,
                        })
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
        )
    }

    function displayApprovalConfirmation(info_id, email){
        let data = {
            'info_id': info_id,
            'approval': 'true',
            'IC_Front': 'true',
            'IC_Back': 'true',
            'Proof_Of_Address': 'true',
            'Payslip/Bank_Statement_1': 'true',
            'Payslip/Bank_Statement_2': 'true'
        }
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
                                    </Typography>
                                </Box>
                            <br/>
                        </Paper>
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
                            Proof_Of_Address: false,
                            Payslip_Bank_Statement_1: false,
                            Payslip_Bank_Statement_2: false,
                        });
                        }}>
                        Cancel
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Button variant='contained' fullWidth
                    onClick={()=>{
                        handleSubmitWithoutReason(data)
                    }}
                    >
                        Submit
                    </ Button>
                </Grid>
                <Grid item xs={12} sm={3}></Grid>
                </Grid>
            </div>
        )
    }

    function displaySuccessfulSubmission(){
        return(
            <Typography variant='h3'>
                Submission Successful!
            </Typography>
        )
    }

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
                    <Grid item xs={12} sm={4}>
                        <Button disabled={handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleResubmitClick(data.documents)}>
                            Request Resubmission
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button disabled={!handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleApprovalClick()}>
                            Approve CE Request
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button disabled={!handleResubmitButton(data.documents)} variant='contained' fullWidth
                        onClick={()=> handleRejectionClick()}>
                            Reject CE Request
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {displayDocumentTable(data.documents)}
                    </Grid>
                </ Grid>
            )
            } else if (submitState){
                return(displaySuccessfulSubmission())
            } else if (resubmitState){
                return(displayResubmitConfirmation(rejectedDocsArr, data.info_id, reason, data.email))
            } else if (approvalState){
                return(displayApprovalConfirmation(data.info_id, data.email))
            } else if (rejectionState){
                return(displayRejectionConfirmation(data.info_id, data.email, reason))
            }
        }else{
            return(
                <Typography variant='h5'>
                    There are no files for verification
                </Typography>
            )
        }
    }

    return (
        confirmDisplay(data, rejectedDocsArr)
    )
}

export default VerificationDocs
