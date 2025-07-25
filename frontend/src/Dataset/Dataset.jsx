import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import TrainVocabList from "./Components/TrainVocab";
import TestVocabList from "./Components/TestVocab";
import Overview from "./Components/OverviewMainPage";
import TitleLabel from "../Components/TitleLabel";

import "./Dataset.css";

const Dataset = () => {
    const { id } = useParams();

    const [dataset, setDataset] = useState(null);
    const [mode, setMode] = useState("overview");

    const fetchDataset = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000" + "/datasets/" + id, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setDataset(data);
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching datasets: ', error);
        }
    };


    useEffect(() => {
        fetchDataset();
    }, []);

    if (!dataset) {
        return <div className="main-container">
            <TitleLabel text="Loading dataset..." />
        </div>;
    }

    return (
        <div>
            <div className="main-container" style={{ display: "flex"}}>
                <aside className="sidebar" style={{ paddingRight: "2rem", paddingTop: "1rem" }}>
                    <ul style={{ paddingTop: "2rem"}}>
                        <li>
                            <button
                                className={mode === "overview" ? "active" : ""}
                                onClick={() => setMode("overview")}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
                            >
                                Overview
                            </button>
                        </li>
                        <li>
                            <button
                                className={mode === "train" ? "active" : ""}
                                onClick={() => setMode("train")}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
                            >
                                Train
                            </button>
                        </li>
                        <li>
                            <button
                                className={mode === "test" ? "active" : ""}
                                onClick={() => setMode("test")}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
                            >
                                Test
                            </button>
                        </li>
                    </ul>
                </aside>
                <main style={{ flex: 1, padding: "1rem" }}>
                    <TitleLabel text={dataset.name} />
                    {mode === "overview" && (
                        <Overview dataset={dataset} />
                    )}
                    {mode === "train" && (
                        <TrainVocabList dataset={dataset} />
                    )}
                    {mode === "test" && (
                        <TestVocabList dataset={dataset} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dataset;