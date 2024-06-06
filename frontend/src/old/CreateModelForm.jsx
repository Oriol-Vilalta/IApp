import {useState} from "react"

const CreateModelForm = ({ }) => {
    const [name, setName] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name
        }
        const url = "http://localhost:5000/models"
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await  response.json()
            alert(data.message)
        } else {

        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor={"Name"}>Name:</label>
                <input
                    type={"text"}
                    id={"name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type={"submit"}>Create Model</button>
            </div>
        </form>
    );

};

export default CreateModelForm