import {Button} from "@mui/material";


const removeData = ({url}) => {

    const remove = () => {
        const res = fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            }
        })
        if(res.status === 404) console.log(res.status)
    }

    return (<Button variant="outlined" color="error" onDoubleClick={remove}>REMOVE</Button>)
}

export default removeData;