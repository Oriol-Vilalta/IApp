import {Button} from "@mui/material";
import React, {useRef} from "react";


const UploadData = ({url, text}) => {

    const fileInputRef = useRef(null);

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
            const res = await fetch(url, {
                mode: 'cors',
                method: 'POST',
                body: formData,
            })

            if (res.status === 400) {
                alert(res.json()['error'])
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (<Button variant={"contained"}
                   component="label"
                   style={{margin: '5px'}}
                   onClick={handleButtonClick}>
        {text}
        <input
            type="file"
            ref={fileInputRef}
            style={{display: 'none'}}
            onChange={handleUploadChange}
        />
    </Button>)
}

export default UploadData;
