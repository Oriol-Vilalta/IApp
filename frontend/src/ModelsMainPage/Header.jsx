import React, {useRef} from 'react';
import {Button, TextField, Alert} from "@mui/material";
import UploadData from './UploadData'

const Header = () => {
    const [isCreateModelPopUpOpen, setIsCreateModelPopUpOpen] = React.useState(false);
    const [modelAlreadyExists, setModelAlreadyExists] = React.useState(false);
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


    const createModelPopUp = {
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

    const newModelTextField = {
        width: '90%',
        borderColor: 'white',
        fontColor: 'white',
    }



    // Functionality Pop Up
    const closeCreatePopUp = () => {
        setIsCreateModelPopUpOpen(false);
        setModelAlreadyExists(false);
    }

    const openCreatePopUp = () => {
        if (!isCreateModelPopUpOpen) setIsCreateModelPopUpOpen(true);
    }


    const changeName = (e) => {
        setName(e.target.value)
        setModelAlreadyExists(false)
    }


    const onSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://127.0.0.1:5000/models';
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: name})
            });

            console.log('Response Status:', res.status);

            if(res.status === 201) {
                closeCreatePopUp();
                location.reload();
            } else if (res.status === 400) {
                setModelAlreadyExists(true)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return <div style={container}>
        {/* Create Model Pop Up*/}
        {isCreateModelPopUpOpen && <div style={createModelPopUp}>
            <div style={popUpContent}>
                <form onSubmit={onSubmit}>
                    <div>
                        <TextField
                            id="standard-basic"
                            label="Name"
                            variant="outlined"
                            style={newModelTextField}
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
                        { modelAlreadyExists &&
                            <Alert variant="filled" severity="error">Model {name} already exists</Alert>
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
            <h1>Models</h1>
        </div>
        <div>
            <UploadData url={'http://127.0.0.1:5000/models/upload'} text={"UPLOAD"}></UploadData>
            <Button variant={"contained"} style={{margin: '5px'}} onClick={openCreatePopUp}>Create</Button>
        </div>
    </div>
}

export default Header;