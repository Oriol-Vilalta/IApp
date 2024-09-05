import {
    Button, Chip,
    FormControl,
    InputLabel,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    MenuList,
    Select, TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";



const DatasetConfig = ({model}) => {
    const [datasets, setDatasets] = useState([]);
    const [choosenDataset, setChoosenDataset] = useState(null);

    const [bs, setBs] = useState(model.loader.bs);
    const [seed, setSeed] = useState(model.loader.seed);
    const [validPct, setValidPct] = useState(model.loader.valid_pct);
    const [transformationType, setTransformationType] = useState(model.loader.item_tfms.type);
    const [transformationSize, setTransformationSize] = useState(model.loader.item_tfms.size);
    const [transformationResizingType, setTransformationResizingType] = useState(model.loader.item_tfms);

    const [applied, setApplied] = useState(false);


    const fetchDatasets = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/datasets', {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDatasets(data.datasets)

        } catch (error) {
            console.error('Error fetching datasets:', error);
        }

    }

    useEffect(() => {
        fetchDatasets();
    }, [])

    const changeDataset = (event) => {
        setApplied(false)
        setChoosenDataset(event.target.value);
    };

    const changeSeed = (event) => {
        setApplied(false)
        setSeed(event.target.value);
    };

    const changeBs = (event) => {
        setApplied(false)
        setBs(event.target.value);
    };

    const changeValidPct = (event) => {
        setApplied(false)
        setValidPct(event.target.value);
    }

    const changeTransformationType = (event) => {
        setApplied(false)
        setTransformationType(event.target.value);
    }

    const changeTransformationSize = (event) => {
        setApplied(false)
        setTransformationSize(event.target.value);
    }

    const changeTransformationResizingType = (event) => {
        setApplied(false)
        setTransformationResizingType(event.target.value);
    }



    const container = {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'aqua',
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

    const invisibleContainer = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        placeItems: 'left',
        width: '100%',
        height: '100%',
    }

    const defaultDataset = () => {
        for(let i= 0; i < datasets.length; i++){
            if(datasets[i].id == model.loader.dataset_id) {
                return model.name
            }
        }
    }

    const applyChanges = async () => {
            const url = 'http://127.0.0.1:5000/models/' + model.id + '/dataset';
            try {
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({dataset_id: choosenDataset})
                });

                if(res.status !== 200) {
                    alert(res.json()['error']);
                }
            } catch (error) {
                console.error('Error:', error);
            }

        const url1 = 'http://127.0.0.1:5000/models/' + model.id + '/change_loader_property';
        try {
            const res = await fetch(url1, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bs: parseInt(bs),
                    valid_pct: parseFloat(validPct),
                    seed: parseInt(seed),
                    item_tfms: {
                        type: transformationType,
                        size: parseInt(transformationSize),
                        resize_method: transformationResizingType,
                    }
                })
            });
            if(res.status !== 200) {
                alert(res.json()['error']);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setApplied(true)

    }


    return (<div style={container}>
        <h2>DLS</h2>
        <div>
            <FormControl fullWidth style={leftOriented}>
                <label>Dataset:</label>
                <Select
                    defaultValue={defaultDataset}
                    value={choosenDataset}
                    onChange={changeDataset}
                    sx={fields}
                    mandatory
                >
                    {datasets.map((dataset) => (
                        <MenuItem value={dataset.id}>{dataset.name}</MenuItem>
                    ))}
                </Select>

                <label style={label}>Batch Size</label>
                <TextField type={"number"} defaultValue={model.loader.bs} id="bs" style={fields}
                           onChange={changeBs}/>

                <label style={label}>Seed</label>
                <TextField type={"number"} defaultValue={model.loader.seed} id="seed" style={fields}
                           onChange={changeSeed}/>

                <label style={label}>Validation Percentage</label>
                <TextField type={"number"} defaultValue={model.loader.valid_pct} id="valid_pct" style={fields} min={0}
                           max={1} onChange={changeValidPct}/>

                <label style={label}>Transformation</label>
                <label style={label}>Type</label>
                <Select
                    value={transformationType}
                    onChange={changeTransformationType}
                    style={fields}
                    defaultValue={model.loader.item_tfms.type}
                >
                    <MenuItem value={'resize'}>Resize</MenuItem>
                </Select>

                {transformationType === 'resize' && <div style={invisibleContainer}>
                    <label style={label}>Transformation Size</label>
                    <TextField type={"number"}
                               defaultValue={model.loader.item_tfms.size}
                               onChange={changeTransformationSize}
                               id="resize_size"
                               style={fields}
                               />

                    <label style={label}>Type of resizing</label>
                    <Select
                        value={transformationResizingType}
                        onChange={changeTransformationResizingType}
                        defaultValue={model.loader.item_tfms.size}
                        style={fields}
                    >
                        <MenuItem value={'crop'}>Crop</MenuItem>
                        <MenuItem value={'pad'}>Pad</MenuItem>
                        <MenuItem value={'squish'}>Squish</MenuItem>
                    </Select>
                </div>
                }
                <div style={{display: 'flex', placeItems: 'center', alignItems: 'center', marginTop: '10px'}}>
                    <Button variant={"contained"} onClick={applyChanges}>APPLY CHANGES</Button>
                    { applied && <Chip label="Up to date" color="success" variant="outlined"/> }
                </div>


            </FormControl>

        </div>
    </div>)
}

export default DatasetConfig;