import React, { useState } from "react";
import DatasetConfiguration from "./DatasetConfiguration";
import "../MainPage.css";
import LearnerConfiguration from "./LearnerConfiguration";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";



const TrainMainPage = ({ model }) => {
    const [datasetConfig, setDatasetConfig] = useState(model.loader);
    const [learnerConfig, setLearnerConfig] = useState(model.learner);

    const startTrainingRoutine = () => {
        Promise.all([saveDatasetConfig(), saveLearnerConfig()])
            .then(() => {
                console.log("Training with configuration:", {
                    datasetConfig,
                    learnerConfig,
                });
                if (window.confirm("Are you sure you want to start training?")) {
                    train();
                }
            })
            .catch((error) => {
                console.error("Error saving configurations:", error);
            });


    };

    const saveDatasetConfig = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/change_loader_property", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datasetConfig)
            });

            if (!response.ok) {
                throw new Error("Failed to save dataset configuration");
            }
        } catch (error) {
            console.error("Error saving dataset configuration:", error);
        }
    }

    const saveLearnerConfig = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/change_learner_property", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(learnerConfig)
            });

            if (!response.ok) {
                throw new Error("Failed to save learner configuration");
            }
        } catch (error) {
            console.error("Error saving learner configuration:", error);
        }
    }

    const train = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/train", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to train");
            }
        } catch (error) {
            console.error("Error while training:", error);
        }
    }

    return (
        <div className="main-page">
            <h1>Train Model</h1>
            <p>
                Configure your dataset and learner settings below, then click <b>TRAIN</b> to start training your model.
            </p>
            <div style={{ display: "flex", gap: "2rem" }}>
                <div style={{ flex: 1 }}>
                    <DatasetConfiguration
                        model={model}
                        config={datasetConfig}
                        setConfig={setDatasetConfig}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <LearnerConfiguration
                        model={model}
                        config={learnerConfig}
                        setConfig={setLearnerConfig}
                    />
                </div>
            </div>
            <div style={{marginTop: "2rem"}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={startTrainingRoutine}
                    disabled={model.state === "IN_TRAINING"}
                    style={{
                        padding: "0.75rem 2rem",
                        fontSize: "1rem",
                    }}
                >
                    {model.state === "IN_TRAINING" ? "TRAINING..." : "TRAIN"}
                </Button>
            </div>
        </div>
    );
}

export default TrainMainPage;