import "./MainPage.css";

import { useState } from "react";
import { getRequest } from "../Utils/api";
import TitleLabel from "../Components/TitleLabel";

const DatasetsPage = () => {
    const [datasets, setDatasets] = useState([]);


    function sortDatasetsByDate(datasets) {
        return datasets.sort(function (a, b) {return ('' + a.last_accessed).localeCompare(b.last_accessed)})
    }

    const fetchDatasets = async () => {
        try {
            const response = getRequest('/datasets');
            if (response.status === 200) {
                const data = await response.json();
                setDatasets(data);
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching datasets: ', error);
        }

    }


    return (
        <div className="main-page">
            <TitleLabel text="Datasets" />

        </div> 
    );

}

export default DatasetsPage;