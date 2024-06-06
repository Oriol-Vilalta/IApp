import './App.css'
import { useState, useEffect } from 'react'
import ModelList from './MainPage/Models.jsx'
import Header from './MainPage/Header.jsx'

function App() {
    const [models, setModels] = useState([])

    const fetchModels = async () => {
        const response = await fetch("http://localhost:5000/models")
        const data = await response.json()
        setModels(data.models)
    }

    useEffect(() => {
        fetchModels()
    }, [])

    return (
        <>
            <Header/>
            <ModelList models={models}/>
            {/*<UploadModel/>*/}
        </>
    )
}

export default App
