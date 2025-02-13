import React, {useState} from "react";
import {Box, Button, Chip, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import UploadData from "../../ModelsMainPage/UploadData.jsx";
import RemoveData from "./RemoveData.jsx";


const TrainingData = ({dataset}) => {


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

    const deleteLabel  = async (vocab) => {
        const url = 'http://127.0.0.1:5000/datasets/'+ dataset.id + '/delete_label';

        const data = { 'label': vocab}

        try {
            const res = await fetch(url, {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })

            if (res.status === 400) {
                console.log(res.json()['error'])
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }




    return (<div>
        <div style={container}>
            <h2>Training Data ({dataset.train_vocab.length})</h2>
            <div>
                <RemoveData url={'http://127.0.0.1:5000/datasets/' + dataset.id + '/delete_train'}></RemoveData>
                <UploadData url={'http://127.0.0.1:5000/datasets/' + dataset.id + '/upload_train'} text={"UPLOAD"}></UploadData>
            </div>

        </div>
        <Box sx={{ maxWidth: 'auto' }}>
            <List style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                {dataset.train_vocab.map((vocab) => (
                    <ListItem key={vocab} style={listElements} disablePadding secondaryAction={
                        <Button onClick={() => deleteLabel(vocab)}>DELETE</Button>
                    }>
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

export default TrainingData;