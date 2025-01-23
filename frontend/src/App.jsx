import './App.css'
import ModelsMainPage from "./ModelsMainPage/ModelsMainPage.jsx";
import React, {useState} from "react";
import {Button} from "@mui/material";
import './NavBar/navbar.css'
import DatasetsMainPage from "./DatasetsMainPage/DatasetsMainPage.jsx";


function App() {
    const [mode, setMode] = useState("models");

    function changeToDatasets() {
        setMode("datasets");
    }

    function changeToModels() {
        setMode("models");
    }



    return (
            <>
                <ul className={"classUl"}>
                    <li className={"classLi"}>
                        <Button className={"classLiA"} onClick={changeToModels} sx={"color: white"}>
                            Models
                        </Button>
                    </li>
                    <li className={"classLi"}>
                        <Button className={"classLiA"} onClick={changeToDatasets} sx={"color: white"}>
                            Datasets
                        </Button>
                    </li>
                </ul>


                {mode === "models" &&
                    <ModelsMainPage/>
                }
                { mode === "datasets" &&
                    <DatasetsMainPage/>
                }
                {/*<ModelsMainPage/>*/}
            </>
    )
}

export default App
