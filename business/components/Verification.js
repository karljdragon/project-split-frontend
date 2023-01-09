import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import VerificationDocs from './VerificationDocs';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';


const columns = [
  { 
      id: 'submitted_timestamp', 
  label: 'Submission\u00a0Date', 
  minWidth: 100 
  },
  { 
      id: 'customer_name', 
  label: 'Customer\u00a0Name', 
  minWidth: 100 
  },
  {
    id: 'customer_email',
    label: 'Customer\u00a0Email',
    minWidth: 100
  },
  {
    id: 'merchant',
    label: 'Merchant',
    minWidth: 100
  },
  {
    id: 'order_number',
    label: 'Order\u00a0Number',
    minWidth: 100
  },
];

function createData(submitted_timestamp, customer_name, customer_email, merchant, order_number, info_id) {

  return { submitted_timestamp, customer_name, customer_email, merchant, order_number, info_id };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100%',
  },
});

function rowsMap(submissions) {
  let row_data = []
  submissions.map((each) => {
    row_data.push(
      createData(each.submission_timestamp.slice(0,10), each.customer_name, each.customer_email, each.merchant, each.order_number, each.info_id)
    )
  })
  return row_data;
}

const url = "http://localhost:9000/internal/";


export default function Verification(props) {

  async function getPendingList(url) {
 
    let pendingURL = url + 'getpendinglist'
    let formData = new FormData();
    formData.append('submission_type', 'CE')
    formData.append('token', props.token)

    let response = await fetch(pendingURL, {
        method: 'POST',
        headers: {
            // await google SSO implementation ?
        },
        body: formData
    })
    let result = await response.json();
    if (result.error){
    } else {
      return result
    }
}
  
  const [listData, setListData] = useState(null)

  useEffect(async () => {
    var data = await getPendingList(url)
    setListData(data.submissions)
  }, [])

  const classes = useStyles();

  var rows = []
  if (listData) {
     rows = rowsMap(listData)
  }

  const [rowInfo, setRowInfo] = useState({
    email: '',
    infoID: ''
  })

  function verificationTable(columns, rows){
    return(
    <>
      <Paper>
          <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow >
                      {columns.map((column) => (
                          <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                          >
                            <Box fontWeight='fontWeightBold'>
                              {column.label}
                            </Box>
                          </TableCell>
                      ))}
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {rows.map((row) => {
                      return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.email} 
                          onClick={()=>{
                            setRowInfo({
                            email: row.customer_email,
                            infoID: row.info_id
                          })}}>
                          {columns.map((column) => {
                              const value = row[column.id];
                              return (
                              <TableCell key={column.id} align={column.align}>
                                  {value}
                              </TableCell>
                              );
                          })}
                          </TableRow>
                      );
                      })}
                  </TableBody>
              </Table>
          </TableContainer>
      </Paper>
    </>
    );
  }


  function displayDocs(email, infoID, columns, rows) {

    if (email) {
      return (
        <VerificationDocs email={email} infoID={infoID} token={props.token}/>
      )
    }else {
      return (
        verificationTable(columns, rows)
      )
    }
  }

  function backButton(email){
    if (email){
      return(
        <Button 
        onClick={()=>setRowInfo({
          email: '',
          infoID: ''
        })}>
          Back to CE Failure Request Selection
        </Button>
      )
    }
  }

  return (
      <>
        {backButton(rowInfo.infoID)}
        <br /> <br />
        <Typography component="h1" variant="h5" align='left'>
          CE Failure Document Verification
        </Typography>
        <br/>
        {displayDocs(rowInfo.email, rowInfo.infoID, columns, rows)}
      </>
  );
}