import {Box, CardContent, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import React, {useState} from "react";


const DatasetList = ({datasets, activeDataset, setActiveDataset }) => {
    const [actualDataset, setActualDataset] = useState(null);

    const setHoveredDataset =  (event, dataset) => {
        setActualDataset(dataset);
    }

    const container = {
        'display': 'grid',
        'gridTemplateColumns': 'auto 250px',
        'gap': '16px',
        'width': 'fit-content',
        'marginTop': '50px',
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

    const cardStyle = {
        'marginTop': '7px',
        ...borderStyle,
        'borderColor': 'green',
    }

    return (<div style={container}>
        <Box sx={{ maxWidth: 'auto' }}>
            <List style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                {datasets.map((dataset) => (
                    <ListItem key={dataset.id} style={listElements} disablePadding>
                        <ListItemButton
                            onMouseEnter={(event) => setHoveredDataset(event, dataset)}
                            component="a"
                            onClick={() => setActiveDataset(dataset)}
                        >
                            <ListItemText primary={dataset.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
        {actualDataset ?
            <Box sx={{minWidth: 275}} style={cardStyle}>
                <CardContent sx={{textAlign: "left"}}>
                    <Typography variant="h4" component="div" sx={{bottomMargin: '2px'}}>
                        {actualDataset.name}
                    </Typography>
                    <Typography color="white"  variant="body2">
                        <h3>Training Vocab:</h3>
                        <ul>
                            { actualDataset.train_vocab.map((word) => (
                                <li>{word}</li>
                            ))}
                        </ul>

                    </Typography>
                    <Typography variant="body2">
                        <h3>Test Vocab:</h3>
                        <ul>
                            { actualDataset.test_vocab.map((word) => (
                                <li>{word}</li>
                            ))}
                        </ul>
                    </Typography>
                </CardContent>
            </Box>
            :null}

    </div>)

}

export default DatasetList