import {useEffect, useState} from "react";
import Header from "./Header.jsx";
import ModelList from "./Models.jsx";
import Model from "./Models/Model.jsx";



const ModelsMainPage = () => {
    const [models, setModels] = useState([]);
    const [activeModel, setActiveModel] = useState(null);


    function sortModelsByDate(models_tmp) {
        return models_tmp.sort(function (a, b) {return (''+ a.last_accessed).localeCompare(b.last_accessed)});
    }

    const fetchModels = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/models', {
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

            setModels(sortModelsByDate(data.models));
        } catch (error) {
            console.error('Error fetching models:', error);
        }

    };
    useEffect(() => {
        const tmp = setInterval(() => {
            fetchModels();
        }, 1000);

    }, [])

    // useEffect(() => {
    //     // Define the function to be run every second
    //     const intervalId = setInterval(() => {
    //         setCount(prevCount => prevCount + 1); // Example function to increment count
    //     }, 1000); // 1000 milliseconds = 1 second
    //
    //     // Cleanup function to clear the interval when component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);


    return (
        <>
            {activeModel !== null &&
                <Model model={activeModel} setActiveModel={setActiveModel}/>
            }

            {activeModel === null && <div>
                <Header/>
                <ModelList models={models} activeModel={activeModel} setActiveModel={setActiveModel} />
            </div>
            }



        </>
    )
}


export default ModelsMainPage;