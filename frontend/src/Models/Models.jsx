import "./MainPage.css";

import { useState } from "react";
import { getRequest } from "../Utils/api";
import Typography from "@mui/material/Typography";

const url = import.meta.env.API_URL


const ModelsPage = () => {
    const [models, setModels] = useState([]);


    function sortModelsByDate(models) {
        return models.sort(function (a, b) {return ('' + a.last_accessed).localeCompare(b.last_accessed)})
    }

    const fetchModels = async () => {
        try {
            const response = getRequest('/models');
            if (response.status === 200) {
                const data = await response.json();
                setModels(data);
            } else {
                console.error('Error fetching models: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching models: ', error);
        }

    }


    return (
        <div className="main-page">
            <h1 className="main-page-title">
                <Typography variant="h4" component="div">
                    Title
                </Typography>
            </h1>
        </div>
    );

}

export default ModelsPage;