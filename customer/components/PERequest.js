import React, {useEffect, useState, prevState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import UploadInfo from './UploadInfo';


// Styling
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


const PERequest = (props) => {

    // assign props to variables 
    const otl = props.otl;
    const JWT = props.JWT;
    const type = props.type;
    const email = props.email;
    const missing_documents = props.missing_documents;

    //create a persistent state for upload error
    const [uploadError, setUploadError] = useState({
        error: []
    });

    //create a persistent state for user inputs
    const [input, setInput] = useState(
        {
            otl: otl,
            JWT: JWT,
            reason: '',
            extdate: '',
            emname: '',
            emrel: '',
            emnum: '',
            ICFrontUploadRef: React.createRef(),
            ICBackUploadRef: React.createRef(),
            proofExtensionUploadRef: React.createRef()
        });

    //function to check if values are in array
    function foundIn(item ,array){
        let outcome = false;
        array.forEach(element => {
            if (element == item){
                outcome = true;
            };
        });
        return outcome;
    };

    //return rows for each document
    function ICFront() {
        return (
        <>
        <Grid item xs={12} sm={8}>
                    <Typography variant="body1" gutterBottom>
                        IC (Front)
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4} >
                    <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={input.ICFrontUploadRef}/>
                </Grid> </>
        );
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
                    <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={input.ICBackUploadRef}/>
                </Grid>
            </>
        );
    };
    function ProofExtension() {
        return(
            <>
                <Grid item xs={12} sm={8}>
                    <Typography variant="body1" gutterBottom>
                        Proof For Extension
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4} >
                    <input type='file' accept=".jpg,.pdf,.png,.jpeg" ref={input.proofExtensionUploadRef}/>
                </Grid>
            </>
        );
    };

    const classes = useStyles();

    //Function to call send_doc API
    async function sendDocAPI(url, data) {
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
            uploadError.error.push(data.filetype.concat(': ',result.error));
        };
        
    };

    //Function to call submit API (nested with calling send_text API)
    async function submitAPI(url, data, textData) {
        let submitURL = url + '/submit_button';
        let textURL = url + '/send_text';

        let error = await sendTextAPI(textURL, textData);
        
        if(!error){
            let formData = new FormData();
            for (var name in data){
                formData.append(name, data[name]);
            };

            let response = await fetch(submitURL, {
                method: 'POST',
                headers: {
                    'Authorization': data.JWT
                },
                body: formData
            });

            let result = await response.json();
            if (result.error){
                let errorSubmit = result.error;
                alert('There was an error submitting your request: ' + errorSubmit);
            }else{
                alert('Documents submitted successfully!');
                window.location.replace("https://paywithsplit.co/");
            }
        }
    };

    //Function to call send_text API
    async function sendTextAPI(url, data){
        
        let formData = new FormData();
        for (var name in data){
            formData.append(name, data[name]);
        };
        let QUERY = {
            method: 'POST',
            headers: {
                'Authorization': data.JWT
            },
            body: formData
        };
        let response = await fetch(url, QUERY);
        let result = await response.json();
        let error = '';
        if (result.error){
            error = result.error;
            alert('There was an error submitting your request: ' + error);
            };
        return error;
        };

    //Function to format and send alerts
    function alertMessage(arr, msg){
        let lineBreak = '\r\n';
        arr.map(x =>
          msg+= lineBreak + '- ' + x
          );
        alert(msg);
      };


    //Function to upload All documents
    async function uploadAll(url){
        let error = [];
        let sendDocURL = url + '/send_doc';

        //Check if value is in missing documents before uploading
        if(foundIn("IC_Front", missing_documents)){
            if(input.ICFrontUploadRef.current.files[0] !== undefined){
                let ICFrontData = {
                    otl: otl,
                    filetype: 'IC_Front',
                    email: email,
                    JWT: JWT,
                    doc: input.ICFrontUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, ICFrontData);
            } else {
                error.push('IC (Front) ');
            };
        };

        if(foundIn("IC_Back", missing_documents)){
            if(input.ICBackUploadRef.current.files[0] !== undefined){
                let ICBackData = {
                    otl: otl,
                    filetype: 'IC_Back',
                    email: email,
                    JWT: JWT,
                    doc: input.ICBackUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, ICBackData);
            } else {
                error.push('IC (Back) ');
            };
        };

        if(foundIn("Proof_For_Extension", missing_documents)){
            if(input.proofExtensionUploadRef.current.files[0] !== undefined){
                let extensionData = {
                    otl: otl,
                    filetype: 'Proof_For_Extension',
                    email: email,
                    JWT: JWT,
                    doc: input.proofExtensionUploadRef.current.files[0],
                };
                await sendDocAPI(sendDocURL, extensionData);
            } else {
                error.push('Proof For Extension ');
            };
        };
        return(error);
    };

    //Submit button click handler
    async function onSubmit(uploadError) {
        let URL = 'http://localhost:5000';
        let error = await uploadAll(URL);
        
        //check if fields are empty
        if(!input.reason){
            error.push('Reason ')
        }
        if(!input.extdate){
            error.push('Extension Date ')
        }
        if(!input.emname){
            error.push('Emergency Contact Name ')
        }
        if(!input.emrel){
            error.push('Emergency Contact Relationship ')
        }
        if(!input.emrel){
            error.push('Emergency Contact Contact Number ')
        }

        //check if there are missing fields or errors with upload
        if (error.length != 0 || uploadError.length != 0){
            
            if (error.length != 0){
                alertMessage(error, 'The following fields are missing:');
            }
            if (uploadError.length != 0){   
                alertMessage(uploadError, 'The following errors have been encountered:');
                setUploadError(prevState =>{
                    return {...prevState, error: []};
                })
            }
        } else {
            let textData = {
                otl: otl,
                JWT: JWT,
                reason: input.reason,
                extdate: input.extdate,
                emname: input.emname,
                emrel: input.emrel,
                emnum: input.emnum
            }

            let submitData = {
                otl: otl,
                email: email,
                JWT: JWT,
            };
            submitAPI(URL, submitData, textData);
        };
    };

    //JSX return value
    return (
        <>
            <Typography component="h1" variant="h4">
                Payment Extension Request
            </Typography>
            <Typography component="h1" variant="h6" align="left">
            Reason for Extension
        </Typography>
        <TextField
                    required
                    id="reason"
                    name="Reason"
                    value={input.reason}
                    fullWidth
                    onChange={e => {
                        const val = e.target.value;
                        setInput(prevState =>{
                            return { ...prevState, reason: val}
                        })
                    }}
                />
        <br/><br/><br/>
        <Typography component="h1" variant="h6" align="left">
            New Extension Date
        </Typography>
        <TextField 
            id="date"
            type="date"
            value={input.extdate}
            onChange={e => {
                const val = e.target.value;
                setInput(prevState =>{
                    return { ...prevState, extdate: val}
                })
            }}
            />
        <br/><br/><br/>
        <Typography component="h1" variant="h6" align="left">
            Emergency Contact Information
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField
                    required
                    id="EmergencyName"
                    name="EmergencyName"
                    label="Name"
                    value={input.emname}
                    fullWidth
                    autoComplete="name"
                    onChange={e => {
                        const val = e.target.value;
                        setInput(prevState =>{
                            return { ...prevState, emname: val}
                        })
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    required
                    id="relationship"
                    name="relationship"
                    label="Relationship"
                    value={input.emrel}
                    fullWidth
                    onChange={e => {
                        const val = e.target.value;
                        setInput(prevState =>{
                            return { ...prevState, emrel: val}
                        })
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    required
                    id="contactNumber"
                    name="contactNumber"
                    label="Contact Number"
                    fullWidth
                    autoComplete="mobile"
                    value={input.emnum}
                    onChange={e => {
                        const val = e.target.value;
                        setInput(prevState =>{
                            return { ...prevState, emnum: val}
                        })
                    }}
                />
            </Grid>
            </Grid>
            <Paper className={classes.paper}>
            <React.Fragment>
            <Grid container spacing={3}>
                {foundIn("IC_Front", missing_documents) && <ICFront />}
                <Divider />
                {foundIn('IC_Back', missing_documents) && <ICBack />}
                <Divider />
                {foundIn("Proof_For_Extension", missing_documents) && <ProofExtension />}
            </Grid>
            </React.Fragment>
            <UploadInfo />
            </Paper>
            <React.Fragment>
                    <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={()=>onSubmit(uploadError.error)}
                        className={classes.button}
                    >
                        Submit
                    </Button>
                    </div>
                </React.Fragment>
            <br/><br/>
        </>
    );
};

export default PERequest;
