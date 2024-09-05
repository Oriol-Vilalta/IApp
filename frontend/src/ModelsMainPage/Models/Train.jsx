import {Button} from "@mui/material";
import {useState} from "react";


const Train = ({model}) => {
    const [loading, setLoading] = useState(false);

    const container = {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'orange',
        borderRadius: '10px',

        width: '100%',
        height: '100%',

        padding: '5px',
        margin: '5px',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const trainModel = async () => {
        setLoading(true);
        const url = 'http://127.0.0.1:5000/models/' + model.id + '/train'
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 200) {
                alert("Model'" + model.name + "' has been trained successfully");
            }
        } catch(e) {
            console.log(e)
        }
        setLoading(false)
    }

    return (<div style={container}>
        <Button variant={"contained"} onClick={trainModel} disabled={loading}>TRAIN</Button>
    </div>)
}

export default Train;