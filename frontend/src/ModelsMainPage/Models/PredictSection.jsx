import {Button, Checkbox} from "@mui/material";
import UploadData from "../UploadData.jsx";
import React, {useEffect, useRef, useState} from "react";


const PredictSection = ({model}) => {
    const [toggle, setToggle] = useState(0);
    const [url, setUrl] = useState('http://127.0.0.1:5000/models/' + model.id + '/predict?grad_cam=true&prob_graph=true');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState("");

    let fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleUploadChange = async (e) => {

        const file = e.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true)

            const res = await fetch(url, {
                mode: 'cors',
                method: 'POST',
                body: formData,
            })

            if (res.status === 400) {
                alert(res.json()['error'])
            } else {
                console.log(res.data)
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    }

    const container = {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'red',
        borderRadius: '10px',

        width: '94.5%',
        height: '700px',

        margin: '5px',
        marginBottom: '15px',
        padding: '30px',

        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',
    }

    const changeCheckBox = () => {
        if (url === 'http://127.0.0.1:5000/models/' + model.id + '/predict?grad_cam=false&prob_graph=true'){
            setUrl('http://127.0.0.1:5000/models/' + model.id + '/predict?grad_cam=true&prob_graph=true');
        } else {
            setUrl('http://127.0.0.1:5000/models/' + model.id + '/predict?grad_cam=false&prob_graph=true');
        }
        console.log(url);
    }


    const toggleButton = () => {
        console.log(toggle);
        if (toggle !== 1) {
            const tog = toggle +1;
            setToggle(tog);
        } else {
            setToggle(0)
        }
    }

    return (<div style={container}>
        <h1 style={{fontSize: 36}}>Predict</h1>

        <div style={{rowFlow: 'row'}}>
            <Button variant={"contained"}
                    component="label"
                    style={{margin: '5px'}}
                    disabled={loading}
                    onDoubleClick={handleButtonClick}>
                PREDICT
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleUploadChange}
                />
            </Button>
            <Button variant="contained" color="primary" onClick={toggleButton}>TOGGLE IMAGE</Button>
            <Checkbox label={"Grad-CAM"} onChange={changeCheckBox} />
            <p></p>
        </div>


        {toggle === 0 &&
            <a href={"http://127.0.0.1:5000/models/" + model.id + "/grad_cam"} target="_blank" >
                <img src={"http://127.0.0.1:5000/models/" + model.id + "/grad_cam"} alt={"Image"}/>
            </a>
        }

        {toggle === 1 &&
            <a href={"http://127.0.0.1:5000/models/" + model.id + "/prob_graph"} target="_blank" rel="noreferrer">
                <img src={"http://127.0.0.1:5000/models/" + model.id + "/prob_graph"} alt={"Image"}/>
            </a>
        }

        {/*{ toggle === 2 &&*/}
        {/*    // <a href={"http://127.0.0.1:5000/models/" + model.id + "/pred_image"} target="_blank" rel="noreferrer">*/}
        {/*    //     <img src={"http://127.0.0.1:5000/models/" + model.id + "/pred_image"} alt={"Image"}/>*/}
        {/*    // </a>*/}
        {/*}*/}


    </div>)
}


export default PredictSection;