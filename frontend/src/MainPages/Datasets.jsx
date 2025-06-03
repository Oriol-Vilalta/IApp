import "./MainPage.css";

import { useState, useEffect } from "react";
import TitleLabel from "../Components/TitleLabel";
import DatasetList from "./Datasets/DatasetList";
import DatasetDetails from "./Datasets/DatasetDetails"; // <-- Import the details component

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
        <div>
            <div className="main-list-page">
                <TitleLabel text="Datasets" amount={datasets.length} />
                <DatasetList datasets={datasets} setActiveDataset={setActiveDataset}/>
            </div>
            <DatasetDetails activeDataset={activeDataset}/>
        </div> 
    );

}

export default DatasetsPage;