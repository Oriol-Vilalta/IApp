import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import React, { useState } from "react";

import DatasetMainPage from "./Dataset/DatasetMainPage";
import TrainMainPage from "./Train/TrainMainPage";
import TestMainPage from "./Test/TestMainPage";
import PredictMainPage from "./Predict/PredictMainPage";


const Model = () => {
    const { id } = useParams();
    const [state, setState] = useState("TRAINED");
    const [mode, setMode] = useState("Dataset");

    return (
        <div style={{ display: "flex" }}>
            <Sidebar setMode={setMode} state={state} />
            
            {mode === "Dataset" && (
                <DatasetMainPage />
            )}

            {mode === "Train" && (
                <TrainMainPage />
            )}

            {mode === "Test" && (
                <TestMainPage />
            )}

            {mode === "Predict" && (
                <PredictMainPage />
            )}
        </div>
    );
};

export default Model;