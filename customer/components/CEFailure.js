import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import UploadInfo from './UploadInfo';

//styling
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

const CEFailure = (props) => {


//CONSTANT DECLARATIONS
    const url = 'http://localhost:5000'
    // set persistent state for upload/submit errors
    const [uploadError, setUploadError] = useState({
        error: []
    });
    const [submitError, setSubmitError] = useState(null);

    // set persistent refs for files
    const [ICFrontUploadRef, setICFrontUploadRRef] = useState(React.createRef());
    const [ICBackUploadRef, setICBackUploadRef] = useState(React.createRef());
    const [addressUploadRef, setAddressUploadRef] = useState(React.createRef());
    const [statement1UploadRef, setStatement1UploadRef] = useState(React.createRef());
    const [statement2UploadRef, setStatement2UploadRef] = useState(React.createRef());

    //create vars from props
    const otl = props.otl;
    const JWT = props.JWT;
    const type = props.type;
    const email = props.email;
    const missing_documents = props.missing_documents;

// HELPER FUNCTIONS

    //fucntion to check if item is in array
    function foundIn(item ,array){
        let outcome = false;
        array.forEach(element => {
            if (element == item){
                outcome = true;
            };
        });
        return outcome;
    };

    // crafts and sends alert message with array
    function alertMessage(arr, text){
        let lineBreak = '\r\n';
        let msg = text;

        arr.map(x =>
            msg+= lineBreak + '- ' + x
            );
        alert(msg);
    };

// API CALL FUNCTIONS

    //function to call submit_buttom API (redirects to pay with split website)
    async function submitAPI(url, data) {
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': data.JWT
            },
            body: formData
        });
        let result = await response.json();
        if (result.error){
            setSubmitError(result.error);
        } else{
            alert('Documents submitted successfully!');
            window.location.replace("https://paywithsplit.co/");
        };
        
    };

    //function to call send_doc API
    async function sendDocAPI(url, data) {
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        }
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': data.JWT
            },
            body: formData
        });
        let result = await response.json();
        if (result.error){
            uploadError.error.push(data.filetype.concat(': ',result.error));
        };
        
    };

    //function to upload all documents 
    async function uploadAll(url){
        let error = [];
        let sendDocURL = url + '/send_doc';

        //checks if the file is required before uploading
        if(foundIn("IC_Front", missing_documents)){
            if(ICFrontUploadRef.current.files[0] !== undefined){
                let ICFrontData = {
                    otl: otl,
                    filetype: 'IC_Front',
                    email: email,
                    JWT: JWT,
                    doc: ICFrontUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, ICFrontData);
            } else {
                error.push('IC (Front) ');
            };
        };

        if(foundIn("IC_Back", missing_documents)){
            if(ICBackUploadRef.current.files[0] !== undefined){
                let ICBackData = {
                    otl: otl,
                    filetype: 'IC_Back',
                    email: email,
                    JWT: JWT,
                    doc: ICBackUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, ICBackData);
            } else {
                error.push('IC (Back) ');
            };
        };

        if(foundIn("Proof_Of_Address", missing_documents)){
            if(addressUploadRef.current.files[0] !== undefined){
                let addressData = {
                    otl: otl,
                    filetype: 'Proof_Of_Address',
                    email: email,
                    JWT: JWT,
                    doc: addressUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, addressData);
            } else {
                error.push('Proof of Address ');
            };
        };

        if(foundIn("Payslip/Bank_Statement_1", missing_documents)){
            if(statement1UploadRef.current.files[0] !== undefined){
                let statement1Data = {
                    otl: otl,
                    filetype: 'Payslip/Bank_Statement_1',
                    email: email,
                    JWT: JWT,
                    doc: statement1UploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, statement1Data);
            }else{
                error.push('Payslip or Bank Statement 1 ');
            };
        };

        if(foundIn("Payslip/Bank_Statement_2", missing_documents)){
            if(statement2UploadRef.current.files[0] !== undefined){
                let statement2Data = {
                    otl: otl,
                    filetype: 'Payslip/Bank_Statement_2',
                    email: email,
                    JWT: JWT,
                    doc: statement2UploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, statement2Data);
            }else {
                error.push('Payslip or Bank Statement 2 ');
            };
        };
        return(error);
    };

// BUTTON CLICK HANDLER

    // submit button click handler
    async function onSubmit(uploadError, url) {
        let error = await uploadAll(url);
        let submitURL = url + '/submit_button';

        if (error.length != 0 || uploadError.length != 0){
            
            if (error.length != 0){
                alertMessage(error, 'The following documents are missing:');
            }
            if (uploadError.length != 0){
                alertMessage(uploadError, 'The following errors have been encountered:');
                setUploadError(prevState =>{
                    return {...prevState, error: []};
                })
            }
        } else {
            let submitData = {
                otl: otl,
                email: email,
                JWT: JWT,
            };
            submitAPI(submitURL, submitData);
            if(submitError){
                alert(submitError);
            };
        };
    };

// JSX FUNCTIONS

    //functions to return JSX for each file type
    function ICFront() {
            return (
            <>
            <Grid item xs={12} sm={8}>
                        <Typography variant="body1" gutterBottom>
                            IC (Front)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={ICFrontUploadRef}/>
                    </Grid> </>);
        };
    function ICBack() {
            return(
                <>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" gutterBottom>
                            IC (Back)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={ICBackUploadRef}/>
                    </Grid>
                </>
            );
        };
    function Address() {
            return(
                <>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" gutterBottom>
                            Proof of Address
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={addressUploadRef}/>
                    </Grid>
                </>
            );
        };
    function Statement1() {
            return(
                <>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" gutterBottom>
                            Payslip or Bank Statement 1
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={statement1UploadRef}/>
                    </Grid>
                </>
            );
        };
    function Statement2() {
            return(
                <>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" gutterBottom>
                            Payslip or Bank Statement 2
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} >
                        <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={statement2UploadRef}/>
                    </Grid>
                </>
            );
        };
    const classes = useStyles();

    //return JSX for CEFailure
    return (
        <>
            <Typography component="h1" variant="h4">
                Document Submission
            </Typography>
            <Paper className={classes.paper}>
            <React.Fragment>
                <Grid container spacing={3}>
                    {foundIn("IC_Front", missing_documents) && <ICFront />}
                    {foundIn('IC_Back', missing_documents) && <ICBack />}
                    {foundIn("Proof_Of_Address", missing_documents) && <Address />}
                    {foundIn("Payslip/Bank_Statement_1", missing_documents) && <Statement1 />}
                    {foundIn("Payslip/Bank_Statement_2", missing_documents) && <Statement2 />}
                </Grid>
                <br/><br/>
                <React.Fragment>
                    <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=>{
                            onSubmit(uploadError.error, url)
                        }}
                        className={classes.button}>
                        Submit
                    </Button>
                    </div>
                </React.Fragment>
            </React.Fragment>
            <UploadInfo />
            </Paper>
        </>
    );
};

export default CEFailure;
