import React, {useState} from "react";
import {Box, Button, Chip, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import UploadData from "../ModelsMainPage/UploadData.jsx";
import RemoveData from "./RemoveData.jsx";


const testingData = ({dataset, setGenOpen}) => {
    const [testingDataVocab, settestingDataVocab] = useState([]);

    const container = {
        display: 'flex',
        justifyContent: 'space-between',
        palaceItems: 'right',
        alignItems: 'right',
    }

    const list_container = {
        display: 'grid',
        gridTemplateColumns: 'auto',
        justifyContent: 'space-between',
        placeItems: 'right',
        alignItems: 'right',
    }

    const borderStyle = {
        'border': 'solid 1px',
        'borderColor': 'gray',
        'borderRadius': '5px',
    };

    const listElements = {
        'marginBottom': '3px',
        'minWidth': '700px',
        'maxWidth': '1000px',
        ...borderStyle
    };


    return (<div>




        <div style={container}>
            <h2>Testing Data ({dataset.test_vocab.length})</h2>
            <div>
                <RemoveData url={'http://127.0.0.1:5000/datasets/' + dataset.id + '/delete_test'}></RemoveData>
                <Button variant={"contained"} sx={{ marginLeft: '4px'}} onClick={setGenOpen}>GENERATE</Button>
                <UploadData url={'http://127.0.0.1:5000/datasets/' + dataset.id + '/upload_test'} text={"UPLOAD"}></UploadData>
            </div>
        </div>
        <Box sx={{maxWidth: 'auto'}}>
            <List style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                {dataset.test_vocab.map((vocab) => (
                    <ListItem key={vocab} style={listElements} disablePadding>
                            <ListItemButton
                                component="a"
                            >

                            <ListItemText primary={vocab} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    </div>)

}

export default testingData;