import "./MainPage.css";

import { useState, useEffect } from "react";
import TitleLabel from "../Components/TitleLabel";

const DatasetsPage = () => {
    const [datasets, setDatasets] = useState([]);


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
                setDatasets(data);
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

        </div> 
    );

}

export default DatasetsPage;