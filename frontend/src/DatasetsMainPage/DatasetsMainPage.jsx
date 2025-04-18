import {useEffect, useState} from "react";
import Header from "./Header.jsx";
import DatasetList from "./Datasets.jsx";
import Dataset from "../Dataset/Dataset.jsx";



function DatasetsMainPage() {
    const [datasets, setDatasets] = useState([]);
    const [activeDataset, setActiveDataset] = useState(null);

    const fetchDatasets = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/datasets', {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDatasets(data.datasets)
        } catch (error) {
            console.error('Error fetching datasets:', error);
        }

    };

    useEffect(() => {
        const tmp = setInterval(() => {
            fetchDatasets();
        }, 1000);
    }, [])



    return (
        <>
            {activeDataset !== null &&
                <Dataset dataset={activeDataset} setActiveDataset={setActiveDataset}></Dataset>
            }

            {activeDataset === null && <div>
                <Header/>
                <DatasetList datasets={datasets} activeDataset={activeDataset} setActiveDataset={setActiveDataset} />
            </div>
            }

        </>

    )
}


export default DatasetsMainPage;