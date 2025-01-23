import {Alert, Button, TextField} from "@mui/material";
import DownloadButton from "../../ModelsMainPage/Models/DownloadButton.jsx";
import TrainingData from "./TrainingData.jsx";
import TestingData from "./TestingData.jsx";
import React, {useState} from "react";
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';


const Dataset = ({dataset, setActiveDataset}) => {
    const [isGenerateTestVisible, setIsGenerateTestVisible] = useState(false);
    const [genValue, setGenValue] = useState(0);

    const close = () => {
        setActiveDataset(null);
    };

    const reload = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/datasets/${dataset.id}`, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            });

            if (!res.ok) {
                console.log(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setActiveDataset(data);
        } catch (error) {
            console.error('Error fetching dataset:', error);
        }
    };

    const deleteDataset = async () => {
        const url = 'http://127.0.0.1:5000/datasets/'+ dataset.id;

        try {
            const res = await fetch(url, {
                method: 'DELETE',
                mode:'cors',
            })

            if(res.status === 200) {
                alert(`Successfully deleted dataset: ${res.json()['message']}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setActiveDataset(null);

    }

    const backButtonContainer = {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        placeItems: 'left',
        alignItems: 'left',
    }

    const topButton = {
        marginRight: '20px',
    }

    const container = {
        display: 'flex',
        justifyContent: 'space-between',
        palaceItems: 'center',
        alignItems: 'center',
    }

    const titleContainer = {
        justifyContent: "center",
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
        setIsGenerateTestVisible(false);
    }

    const openGenerateTestPopUp = () => {
        if (!isGenerateTestVisible) setIsGenerateTestVisible(true);
    }



    const onSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://127.0.0.1:5000/datasets/' + dataset.id + '/generate_test';
        try {
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({test_pct: genValue/100 })
            });

            if(res.status === 200) {
                closeCreatePopUp();
            } else if (res.status === 400) {
                alert("The request failed with status: " + res.json()['message']);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return <div>

        {isGenerateTestVisible && <div style={createModelPopUp}>
            <div style={popUpContent}>
                <form onSubmit={onSubmit}>
                    <div>
                        <NumberInput
                            aria-label="Demo number input"
                            placeholder="Type a number…"
                            value={genValue}
                            min={0}
                            max={100}
                            onChange={(event, val) => setGenValue(val)}
                        />
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

        <div style={backButtonContainer}>
            <Button variant={"contained"} onClick={close} sx={{backgroundColor: 'red'}} style={topButton}>BACK</Button>
            <Button variant={"contained"} onClick={reload} style={topButton}>RELOAD</Button>
        </div>
        <div style={container}>
            <div style={titleContainer}>
                <h1>{dataset.name}</h1>
            </div>
            <div>
                <DownloadButton object={dataset} type={"datasets"}/>
            </div>
        </div>
        <TrainingData dataset={dataset}></TrainingData>
        <TestingData dataset={dataset} setGenOpen={openGenerateTestPopUp}></TestingData>

        <p sx={{marginTop: '30px'}}>Double click</p>
        <Button variant={"contained"}
                color={"error"}
                onDoubleClick={deleteDataset}>DELETE DATASET</Button>
    </div>
}


export default Dataset;