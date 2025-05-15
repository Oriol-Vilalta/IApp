import { getRequest } from "../Utils/api";

const url = import.meta.env.API_URL


const ModelsPage = () => {
    const [models, setModels] = useState([]);


    function sortModelsByDate(models) {
        return models.sort(function (a, b) {return ('' + a.last_accessed).localeCompare(b.last_accessed)})
    }

    const fetchModels = async () => {
        try {
            const response = getRequest('/models')
        } catch (error) {
            console.error('Error while fetching models: ', error)
        }

    }

}

export default ModelsPage;