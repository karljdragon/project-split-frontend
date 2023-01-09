import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';


//styling
const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: '100%',
    },
  });

  //URL Declaration
const url = "http://localhost:9000/internal/";

//Return Function
const Retrieve = (props) => {

    // Set states
    const [email, setEmail] = useState('');

    const [pulledData, setPulledData] = useState({
        email: '',
        documents: null
    })


    const classes = useStyles(); 

    //Open document in external link
    async function openDocument(email, document_type, document_path, url){
        let path = await getURL(url, email, document_type)
        let extension = document_path.split('.')
        extension = extension[extension.length - 1]
        
        if(path){
            window.open('http://localhost:3002/ext=' + extension + 'link=' + path)
        }
    }
 // API Calls
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

    async function getData(url, searchEmail) {
        let detailURL = url + 'documentsearch'
        let formData = new FormData();
        formData.append('email', searchEmail)
        formData.append('token', props.token)
    
        let response = await fetch(detailURL, {
            method: 'POST',
            body: formData
        })
        let result = await response.json();
        if (result.error){
            alert(result.error)
        } else {
            let documents = result.result
            setPulledData({'documents': documents, email: searchEmail})
        }
    }

    // documents = array of objects , returns array of JSX rows with document data.
    function displayAllRows(documents){
        let display_arr = []
        if (documents){
        documents.map((document)=>{
            let current_row = 
            <TableRow hover role="checkbox" >
                <TableCell>
                    {document.document_type}
                </TableCell>
                <TableCell>
                    <Button
                    variant="outlined"
                    fullWidth
                    onClick={()=>openDocument(email, document.document_type, document.document_path, url)}
                    >
                        Open File
                    </Button>
                </TableCell>
            </TableRow>

            display_arr.push(current_row)
        })
        return display_arr
        }
    }

    function displayTable(data){ // pass in data {email: ..., documents: ....}
        if(data.documents && data.documents.length > 0) {
            return(
                <>
                <Typography component="h1" variant="h6" color="inherit" gutterBottom>
                    Submitted Documents for {data.email}:
                </Typography>
                <Paper>
                    
                    <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell><Box fontWeight='fontWeightBold'>Document Type</Box></TableCell>
                                <TableCell><Box fontWeight='fontWeightBold'>View Document</Box></TableCell>
                            </TableRow>
                        </TableHead>
                    <TableBody>
                        {displayAllRows(data.documents)}
                    </TableBody>
                    </Table>
                </TableContainer>
              </Paper>
              </>
            )
        } else if (data.email){
            return(
                <Paper>
                    <Typography variant='h6'>
                        No documents found for: "{data.email}"
                    </Typography>
                </Paper>
            )
        }else{
            return(<></>)
        }
    }

    return (
        <>
        <Typography component="h1" variant="h5" align='left'>
                Retrieve Documents
            </Typography>
            <br/>
        <Paper>
        <Grid container spacing={3}>
                <Grid item xs={12} sm={1}>
                    </Grid>   
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="SearchEmail"
                        value={email}

                        name="SearchEmail"
                        label="Input customer's email to search"
                        fullWidth
                        autoComplete="email"
                        onChange={e => {
                            const val = e.target.value;
                            setEmail(val);
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button 
                    variant="contained"
                    colour="inherit"
                    fullWidth
                    onClick={()=>{
                        setPulledData({documents:[], email:''})
                        getData(url, email)
                        
                    }}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>
            <br/>
        </Paper>
        <br/>
        {displayTable(pulledData)}
        </>
    )
}

export default Retrieve
