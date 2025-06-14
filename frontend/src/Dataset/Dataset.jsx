import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import TrainVocabList from "./Components/TrainVocab";
import TitleLabel from "../Components/TitleLabel";

import "./Dataset.css";

const Dataset = () => {
    const { id } = useParams();

    const [dataset, setDataset] = useState(null);

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


    fetchDataset();

    if (!dataset) {
        return <div className="main-container">
            <TitleLabel text="Loading dataset..." />
        </div>;
    }

    return (
        <div className="main-container">
            <TitleLabel text={dataset.name} />
            <TrainVocabList dataset={dataset} />
        </div>
    );
};

export default Dataset;