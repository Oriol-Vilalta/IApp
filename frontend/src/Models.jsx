import React from "react";
import Card from '@mui/material/Card';
import './Models.css'
import {CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";


const ModelList = ({models}) => {
    return <div>
        <h2>Models</h2>
        <div class="container">
            {models.map((model) => (
                // <<Card key={model.id}>
                //     <p>{model.name}</p>
                // </Card>
                <Card key={model.id} sx={{ maxWidth: 300 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image=""
                            title=""
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {model.name}
                            </Typography>

                        </CardContent>

                    </CardActionArea>
                </Card>
            ))}
            <div>

            </div>
        </div>
    </div>
}



export default ModelList