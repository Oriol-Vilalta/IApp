import React, {useRef} from 'react';
import {Button, TextField, Alert} from "@mui/material";

const Header = () => {
    const [isCreateDatasetPopUpOpen, setIsCreateDatasetPopUpOpen] = React.useState(false);
    const [datasetAlreadyExists, setDatasetAlreadyExists] = React.useState(false);
    const [name, setName] = React.useState('');

    // Styles
    const container = {
        display: 'flex',
        justifyContent: 'space-between',
        palaceItems: 'center',
        alignItems: 'center',
    }

    const titleContainer = {
        justifyContent: 'center',
    };


    const createDatasetPopUp = {
        position: 'fixed',
        zIndex: 1,
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }

    const popUpContent = {
        backgroundColor: '#242424',
        margin: '10% auto',
        padding: '20px',
        border: '1px solid black',
        width: '60%',
    }

    const closePopUp = {
        color: 'red',
        float: 'right',
        fontWeight: 'bold'
    }

    const newDatasetTextField = {
        width: '90%',
        borderColor: 'white',
        fontColor: 'white',
    }



    // Functionality Pop Up
    const closeCreatePopUp = () => {
        setIsCreateDatasetPopUpOpen(false);
        setDatasetAlreadyExists(false);
    }

    const openCreatePopUp = () => {
        if (!isCreateDatasetPopUpOpen) setIsCreateDatasetPopUpOpen(true);
    }


    const changeName = (e) => {
        setName(e.target.value)
        setDatasetAlreadyExists(false)
    }


    const onSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://127.0.0.1:5000/datasets';
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name})
            });

            if(res.status === 201) {
                closeCreatePopUp();
                location.reload();
            } else if (res.status === 400) {
                setDatasetAlreadyExists(true)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleUploadChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file);
        } else {
            console.error('No file selected');
            return;
        }

        const url = 'http://127.0.0.1:5000/datasets/upload';
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(url, {
                mode: 'cors',
                method: 'POST',
                body: formData,
            })

            if(res.status === 200) {
                location.reload();
            } else if (res.status === 400) {
                alert(res.json()['error'])
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }

    return <div style={container}>
        {/* Create dataset Pop Up*/}
        {isCreateDatasetPopUpOpen && <div style={createDatasetPopUp}>
            <div style={popUpContent}>
                <form onSubmit={onSubmit}>
                    <div>
                        <TextField
                            id="standard-basic"
                            label="Name"
                            variant="outlined"
                            style={newDatasetTextField}
                            onChange={(e) => changeName(e)}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'white',
                                }
                            }}
                        />
                        { datasetAlreadyExists &&
                            <Alert variant="filled" severity="error">Dataset {name} already exists</Alert>
                        }
                    </div>
                    <div>
                        <Button
                            style={{backgroundColor: 'green'}}
                            id={"name"}
                            variant={"contained"}
                            type="submit"
                        >Confirm</Button>
                        <Button style={closePopUp} onClick={closeCreatePopUp}>Cancel</Button>
                    </div>
                </form>


            </div>
        </div>}

        <div style={titleContainer}>
            <h1>Datasets</h1>
        </div>
        <div>
            <Button variant={"contained"}
                    component="label"
                    style={{margin: '5px'}}
                    onClick={handleButtonClick}
            >
                Upload
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleUploadChange}
                />
            </Button>

            <Button variant={"contained"} style={{margin: '5px'}} onClick={openCreatePopUp}>Create</Button>
        </div>
    </div>
}

export default Header;