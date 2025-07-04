import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import React, { useEffect, useState } from "react";

import DatasetMainPage from "./Dataset/DatasetMainPage";
import TrainMainPage from "./Train/TrainMainPage";
import TestMainPage from "./Test/TestMainPage";
import PredictMainPage from "./Predict/PredictMainPage";
import OverviewMainPage from "./Overview/OverviewMainPage";


const Model = () => {
    const { id } = useParams();
    const [model, setModel] = useState(null);
    const [hasTest, setHasTest] = useState(false);
    const [mode, setMode] = useState("Overview");

    const fetchModel = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + id, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) { 
                const data = await response.json();
                setModel(data);
            } else {
                console.error('Error fetching model: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching model: ', error);
        }
    };

    const changePage = (newMode) => {
        setMode(newMode);
        fetchModel(); 
    }

    useEffect(() => {
        console.log("Fetching model with ID:", id);
        fetchModel();
    }, [id]);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar setMode={changePage} state={model?.state || ""} />
            
            {mode === "Overview" && (
                <OverviewMainPage model={model}/>
            )}

            {mode === "Dataset" && (
                <DatasetMainPage  model={model} setHasTest={setHasTest} />
            )}

            {mode === "Train" && (
                <TrainMainPage model={model} fetchModel={fetchModel}/>
            )}

            {mode === "Test" && (
                <TestMainPage model={model} hasTest={hasTest} fetchModel={fetchModel}/>
            )}

            {mode === "Predict" && (
                <PredictMainPage model={model}/>
            )}
        </div>
    );
};

export default Model;