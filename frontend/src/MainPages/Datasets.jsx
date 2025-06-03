import "./MainPage.css";

import { useState, useEffect } from "react";
import TitleLabel from "../Components/TitleLabel";
import DatasetList from "./Datasets/DatasetList";

const DatasetsPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [activeDataset, setActiveDataset] = useState(null);

    const fetchDatasets = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000" + "/datasets", {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setDatasets(data.datasets);
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching datasets: ', error);
        }

    }

    useEffect(() => {
        fetchDatasets();
        const interval = setInterval(fetchDatasets, 2000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="main-page">
            <TitleLabel text="Datasets" />
            <DatasetList datasets={datasets} setActiveDataset={setActiveDataset}/>
        </div> 
    );

}

export default DatasetsPage;