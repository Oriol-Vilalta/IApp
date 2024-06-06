import React from 'react';
import {Button} from "@mui/material";


const Header = () => {

    const titleContainer = {
        display: 'flex',
        palaceItems: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const buttonContainer = {
        alignItems: 'center',
    };

    const buttonStyle = {
        display: 'block'
    };

    return <div className="container">
        <div style={titleContainer}>
            <h1>Models</h1>
        </div>
        <div style={buttonContainer}>
            <Button variant={"contained"} style={buttonStyle}>Upload</Button>
            <Button variant={"contained"} style={buttonStyle}>Create</Button>
        </div>
    </div>
}

export default Header;