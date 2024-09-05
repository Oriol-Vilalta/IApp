import React from "react";
import {useState} from "react";
import {
    Box, Button,
    CardActions,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";


const ModelList = ({models, activeModel, setActiveModel}) => {
    const [actualModel, setActualModel] = useState(null);

    const setHoveredModel =  (event, model) => {
        setActualModel(model);
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
                {models.map((model) => (
                    <ListItem key={model.id} style={listElements} disablePadding secondaryAction={
                        <Chip label={model.state} color="primary"/>
                    }>
                        <ListItemButton
                            onMouseEnter={(event) => setHoveredModel(event, model)}
                            component="a"
                            onClick={() => setActiveModel(model)}
                        >

                            <ListItemText primary={model.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
        {actualModel ?
            <Box sx={{minWidth: 275}} style={cardStyle}>
                <CardContent sx={{textAlign: "left"}}>
                    <Typography variant="h4" component="div" sx={{bottomMargin: '2px'}}>
                        {actualModel.name}
                    </Typography>
                    <Typography color="white"  variant="body2">
                        {actualModel.state}
                    </Typography>
                    <p></p>
                    <Typography variant={"h5"} color="white">
                        Learner
                    </Typography>
                    <Typography color="white"  variant="body2">
                        Epoches: {actualModel.learner.epoch}
                    </Typography>
                    <Typography variant="body2">
                        Architecture: {actualModel.learner.arch}
                    </Typography>
                    <Typography color="white"  variant="body2">
                        Learning Rate: {actualModel.learner.lr}
                    </Typography>
                    <p></p>
                    <Typography variant="h5" color="white">
                        Data Loader
                    </Typography>
                    <Typography color="white" variant="body2">
                        Dataset: {actualModel.loader.dataset_id}
                    </Typography>
                    <Typography color="white" variant="body2">
                        Batch Size: {actualModel.loader.bs}
                    </Typography>
                    <Typography color="white" variant="body2">
                        Validation Percentage: {actualModel.loader.valid_pct}
                    </Typography>
                    <Typography color="white" variant="body2">
                        Seed: {actualModel.loader.seed}
                    </Typography>
                    <p></p>
                    <Typography color="white" variant="body2">
                        Transformation: {actualModel.loader.item_tfms.type}
                    </Typography>
                    <Typography color="white" variant="body2">
                        Transformation Size: {actualModel.loader.item_tfms.size}
                    </Typography>
                    <Typography color="white" variant="body2">
                        Transformation Method: {actualModel.loader.item_tfms.resize_method}
                    </Typography>
                </CardContent>
            </Box>
        :null}

    </div>)
}

export default ModelList