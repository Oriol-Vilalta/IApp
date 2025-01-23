import { DataGrid } from '@mui/x-data-grid';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useEffect, useState} from "react";


const ResultsDisplay = ({model}) => {
    const [rows, setRows] = useState([]);


    const container = {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'white',
        borderRadius: '10px',

        width: '98%',
        height: '600px',

        padding: '5px',
        margin: '5px',
        marginBottom: '15px'
    }


    const getResults = async () => {

        try {
            const url = 'http://127.0.0.1:5000/models/' + model.id + '/results'
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            setRows(data['result'])
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getResults();
    }, [])

    return (<div>
        <h3>Training Results</h3>
        <p>Total Training Time: {model.learner.training_time} </p>
        <TableContainer component={Paper}
                        sx={{borderRadius: '10px', marginBottom: '15px', width: '99%', marginLeft: '8px'}}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Epoch</TableCell>
                        <TableCell align="right">Accuracy</TableCell>
                        <TableCell align="right">Error Rate</TableCell>
                        <TableCell align="right">Train Loss</TableCell>
                        <TableCell align="right">Validation Loss</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.epoch}
                            sx={{'&:last-child td, &:last-child th': {border: 0, height: '4px'}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.epoch}
                            </TableCell>
                            <TableCell align="right">{row.accuracy}</TableCell>
                            <TableCell align="right">{row.error_rate}</TableCell>
                            <TableCell align="right">{row.train_loss}</TableCell>
                            <TableCell align="right">{row.valid_loss}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}

export {ResultsDisplay}