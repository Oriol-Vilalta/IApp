import "./MainPage.css";

import { useState, useEffect } from "react";
import TitleLabel from "../Components/TitleLabel";
import ModelList from "./Models/ModelList";

const ModelsPage = () => {
    const [models, setModels] = useState([]);
    const [activeModel, setActiveModel] = useState(null);

    const fetchModels = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models", {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setModels(sortModelsByDate(data.models));
            } else {
                console.error('Error fetching models: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching models: ', error);
        }

    }

    function sortModelsByDate(models) {
        return [...models].sort((a, b) => ('' + b.last_accessed).localeCompare(a.last_accessed));
    }

    useEffect(() => {
        fetchModels();
        const interval = setInterval(fetchModels, 2000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="main-page">
            <TitleLabel text="Models" amount="2"/>
            <ModelList models={models} setActiveModel={setActiveModel}/>
        </div> 
    );

}

export default ModelsPage;