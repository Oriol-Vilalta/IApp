import React, { useState } from "react";
import DatasetConfiguration from "./DatasetConfiguration";
import "../MainPage.css";
import LearnerConfiguration from "./LearnerConfiguration";
import Button from "@mui/material/Button";

const TrainMainPage = ({ model, fetchModel }) => {
    const [datasetConfig, setDatasetConfig] = useState(model.loader);
    const [learnerConfig, setLearnerConfig] = useState(model.learner);
    const [configSaved, setConfigSaved] = useState(false);

    const saveAllConfigs = async () => {
        try {
            await saveDatasetConfig();
            await saveLearnerConfig();
            setConfigSaved(true);
        } catch (error) {
            setConfigSaved(false);
            alert("Error saving configurations. Please try again.");
        }
    };

    const startTrainingRoutine = () => {
        if (window.confirm("Are you sure you want to start training?")) {
            train();
        }
    };

    const saveDatasetConfig = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/change/property/loader", {
                method: "PUT",
                mode: "cors",
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
            throw error;
        }
    };

    const saveLearnerConfig = async () => {
        try {
            const { test_accuracy, test_loss, training_time, type, ...allowedConfig } = learnerConfig;
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/change/property/learner", {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(allowedConfig)
            });

            if (!response.ok) {
                throw new Error("Failed to save learner configuration");
            }
        } catch (error) {
            console.error("Error saving learner configuration:", error);
            throw error;
        }
    };

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
            alert(`Training started successfully!\nModel ID: ${model.id}\nModel Name: ${model.name}`);
            fetchModel();
        } catch (error) {
            console.error("Error while training:", error);
            alert("Error while starting training.");
        }
    };

    return (
        <div className="main-page">
            <h1>Train Model</h1>
            <p>
                Configure your dataset and learner settings below. When ready, click <b>Save Configuration</b> to store your settings, then click <b>TRAIN</b> to start training your model.
            </p>
            <div
                style={{
                    display: "flex",
                    gap: "2rem",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",

                }}
            >
                <div style={{ flex: 1, maxWidth: 420 }}>
                    <DatasetConfiguration
                        model={model}
                        config={datasetConfig}
                        setConfig={setDatasetConfig}
                        save={() => {}}
                    />
                </div>
                <div style={{ flex: 1, maxWidth: 420 }}>
                    <LearnerConfiguration
                        model={model}
                        config={learnerConfig}
                        setConfig={setLearnerConfig}
                        save={() => {}}
                    />
                </div>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={saveAllConfigs}
                    disabled={model.state === "IN_TRAINING"}
                    style={{
                        padding: "0.75rem 2rem",
                        fontSize: "1rem",
                    }}
                >
                    Save Configuration
                </Button>
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
                {configSaved && (
                    <span style={{ color: "green", fontWeight: 500 }}>
                        Configuration saved!
                    </span>
                )}
            </div>
        </div>
    );
};

export default TrainMainPage;