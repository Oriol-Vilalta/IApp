import { useState, useEffect } from 'react'
import ModelList from './Models'
import './App.css'

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
        <><ModelList models={models}>
        </ModelList></>
    )
}

export default App
