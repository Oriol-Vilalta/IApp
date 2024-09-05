import {Box, Button, CardContent, Chip, Typography} from "@mui/material";
import DownloadButton from "./DownloadButton.jsx";
import React from "react";
import DatasetConfig from "./DatasetConfig.jsx";
import LearnerConfig from "./LearnerConfig.jsx";
import Train from "./Train.jsx";
import TestingSection from "./TestingSection.jsx";
import {ResultsDisplay} from "./ResultsDisplay.jsx";
import TrainedSection from "./TrainedSection.jsx";



const Model = ({model, setActiveModel}) => {
    const close = () => {
        setActiveModel(null);
    };

    const reload = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/models/${model.id}`, {
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
            setActiveModel(data);
        } catch (error) {
            console.error('Error fetching dataset:', error);
        }
    };

    const deleteModel = async () => {
        const url = 'http://127.0.0.1:5000/models/'+ model.id;

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
        setActiveModel(null);

    }

    const backButtonContainer = {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        placeItems: 'left',
        alignItems: 'left',
    }

    const container = {
        display: 'flex',
        justifyContent: 'space-between',
        palaceItems: 'center',
        alignItems: 'center',
    }

    const titleContainer = {
        display: 'flex',
        flexDirection: 'row',
        placeItems: 'left',
        alignItems: 'left',
    };

    const topButton = {
        marginRight: '20px',
    }

    const gridContainer = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        placeItems: 'center',
        height: '800px'
    }

    const gridElement = {
        border: '1px solid lightgray',
    }

    const cardStyle = {
        'marginTop': '7px',
        'border': 'solid 1px',
        'borderRadius': '5px',
        'borderColor': 'green',
    }

    return (<div>
            <div style={backButtonContainer}>
                <Button variant={"contained"} onClick={close} sx={{backgroundColor: 'red'}}
                        style={topButton}>BACK</Button>
                <Button variant={"contained"} onClick={reload} style={topButton}>RELOAD</Button>
            </div>
            <div style={container}>
                <div style={titleContainer}>
                    <h1>{model.name}</h1>
                    <Chip label={model.state} color={"primary"} sx={{marginTop: '32px', marginLeft: '20px'}}/>
                </div>
                <div>
                    <DownloadButton object={model} type={"models"}/>
                </div>
            </div>
            {model.state === "TRAINED" && <div>
                <ResultsDisplay model={model}/>
                <TrainedSection model={model}/>
            </div>}
            <div style={gridContainer}>
                <DatasetConfig model={model}></DatasetConfig>
                <LearnerConfig model={model}></LearnerConfig>
                <Train model={model}></Train>

            </div>

            <p sx={{marginTop: '50px'}}>Double click</p>
            <Button variant={"contained"}
                    color={"error"}
                    onDoubleClick={deleteModel}>DELETE MODEL</Button>
        </div>
    )
}

export default Model