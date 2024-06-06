import React from "react";
import Card from '@mui/material/Card';
import './Models.css'
import {CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";

const ModelList = ({models}) => {

    const cardStyle = {

    };

    const cardContentStyle = {
        backgroundColor:'green',
        color: 'white',
        display: 'flex',
    };


    return <div className="container">
        {models.map((model) => (
            <Card key={model.id} style={cardStyle}>
                <CardActionArea sx={{ width: 250, height: 200 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image=""
                        title=""
                    />
                    <CardContent style={cardContentStyle}>
                        <Typography gutterBottom variant="h5" component="div">
                            {model.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        ))}
    </div>
}



export default ModelList