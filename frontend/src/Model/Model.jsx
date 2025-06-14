import { useParams } from "react-router-dom";

const Model = () => {
    const { id } = useParams();

    return <div>Model ID: {id}</div>;
};

export default Model;