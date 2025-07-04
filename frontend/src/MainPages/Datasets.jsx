import "./MainPage.css";

import { useState, useEffect } from "react";
import TitleLabel from "../Components/TitleLabel";
import DatasetList from "./Datasets/DatasetList";
import DatasetDetails from "./Datasets/DatasetDetails"; 
import CreateObjectButton from "../Components/CreateObjectButton";
import CreateDatasetModal from "./Datasets/CreateDatasetModal";
import UploadDatasetButton from "./Datasets/UploadDatasetButton";

const DatasetsPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [activeDataset, setActiveDataset] = useState(null);
    const [showCreateDataset, setShowCreateDataset] = useState(false);

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
                <div className="main-list-header">
                    <TitleLabel text="Datasets" amount={datasets.length} />
                    <CreateObjectButton label="Create Dataset" setShowCreate={setShowCreateDataset}/>
                    <UploadDatasetButton />
                </div>
                <DatasetList datasets={datasets} setActiveDataset={setActiveDataset}/>
            </div>
            <DatasetDetails activeDataset={activeDataset}/>

            <CreateDatasetModal
                showCreateDataset={showCreateDataset} 
                setShowCreateDataset={setShowCreateDataset}
            />
        </div> 
    );

}

export default DatasetsPage;