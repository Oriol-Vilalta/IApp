import {Button, Chip, FormControl, MenuItem, Select, TextField} from "@mui/material";
import React, {useState} from "react";
import * as events from "node:events";


const LearnerConfig = ({model}) => {
    const [arch, setArch] = React.useState(model.learner.arch);
    const [epoch, setEpoch] = React.useState(model.learner.epoch);
    const [lr, setLr] = React.useState(model.learner.lr);

    const [applied, setApplied] = useState(false);

    const container = {
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: 'green',
        borderRadius: '10px',

        width: '100%',
        height: '100%',

        padding: '5px',
        margin: '5px',
    }

    const leftOriented = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        placeItems: 'left',

        padding: '10px'
    }

    const label = {
        marginTop: '10px',
    }

    const fields = {
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'green',
        width: '95%',
        textAlign: 'left'
    }


    const changeArch = (event) => {
        setApplied(false)
        setArch(event.target.value)
    }
    const changeEpoch = (event) => {
        setApplied(false)
        setEpoch(event.target.value)
    }
    const changeLr = (event) => {
        setApplied(false)
        setLr(event.target.value)
    }

    const applyChanges = async () => {
        const url = 'http://127.0.0.1:5000/models/' + model.id + '/change_learner_property';
        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    epoch: parseInt(epoch),
                    lr: parseFloat(lr),
                    arch: arch
                })
            });

            if (res.status !== 200) {
                alert(res.json()['error']);
            }
            setApplied(true)
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (<div style={container}>
        <h2>Learner</h2>
        <FormControl fullWidth style={leftOriented}>
            <label style={label}>Epoches</label>
            <TextField type={"number"} defaultValue={model.learner.epoch} id="epoch" style={fields} min={0}
                       max={1} onChange={changeEpoch}/>

            <label>Arquitecture:</label>
            <Select
                defaultValue={model.learner.arch}
                value={arch}
                onChange={changeArch}
                sx={fields}
                mandatory
            >

                <MenuItem value={"resnet18"}>resnet18</MenuItem>
                <MenuItem value={"resnet34"}>resnet34</MenuItem>
                <MenuItem value={"resnet50"}>resnet50</MenuItem>
                <MenuItem value={"resnet101"}>resnet101</MenuItem>
                <MenuItem value={"resnet152"}>resnet152</MenuItem>
                <MenuItem value={"alexnet"}>alexnet</MenuItem>
                <MenuItem value={"googLeNet"}>googLeNet</MenuItem>
                <MenuItem value={"efficientNet_b0"}>efficientNet_b0</MenuItem>
                <MenuItem value={"efficientNet_b1"}>efficientNet_b1</MenuItem>
                <MenuItem value={"efficientNet_b2"}>efficientNet_b2</MenuItem>
                <MenuItem value={"efficientNet_b3"}>efficientNet_b3</MenuItem>
                <MenuItem value={"efficientNet_b4"}>efficientNet_b4</MenuItem>
                <MenuItem value={"efficientNet_b5"}>efficientNet_b5</MenuItem>
                <MenuItem value={"efficientNet_b6"}>efficientNet_b6</MenuItem>
                <MenuItem value={"efficientNet_b7"}>efficientNet_b7</MenuItem>
                <MenuItem value={"densenet121"}>densenet121</MenuItem>
                <MenuItem value={"densenet161"}>densenet161</MenuItem>
                <MenuItem value={"densenet169"}>densenet169</MenuItem>
                <MenuItem value={"densenet201"}>densenet201</MenuItem>
                <MenuItem value={"vgg16"}>vgg16</MenuItem>
                <MenuItem value={"vgg19"}>vgg19</MenuItem>
                <MenuItem value={"vgg16_bn"}>vgg16_bn</MenuItem>
                <MenuItem value={"vgg19_bn"}>vgg19_bn</MenuItem>



            </Select>
            <label style={label}>Learning Rate</label>
            <TextField type={"number"} defaultValue={model.learner.lr} id="lr" style={fields} min={0}
                       max={1} onChange={changeLr}/>

            <div style={{display: 'flex', placeItems: 'center', alignItems: 'center', marginTop: '10px'}}>
                <Button variant={"contained"} onClick={applyChanges}>APPLY CHANGES</Button>
                { applied && <Chip label="Up to date" color="success" variant="outlined"/> }
            </div>

        </FormControl>
    </div>)
}


export default LearnerConfig;