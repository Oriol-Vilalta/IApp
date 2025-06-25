import { useEffect, useState } from "react";
import "../MainPage.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Button } from "@mui/material";

const DatasetMainPage = ({ model, setHasTest }) => {
    const [datasets, setDatasets] = useState([]);
    const [dataset, setDataset] = useState(null);
    const [selectedDatasetId, setSelectedDatasetId] = useState("");


    const fetchDatasets = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/datasets", {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setDatasets(data.datasets);

                // Only set selectedDatasetId if the model's dataset_id is in the list
                const defaultId = model?.loader?.dataset_id;
                const found = data.datasets.find(ds => ds.id === defaultId);
                if (found) {
                    setSelectedDatasetId(defaultId);
                    fetchDataset(defaultId);
                } else if (data.datasets.length > 0) {
                    setSelectedDatasetId(data.datasets[0].id);
                    fetchDataset(data.datasets[0].id);
                }
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching datasets: ', error);
        }
    };

    const fetchDataset = async (id) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/datasets/" + id, {
                mode: 'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setDataset(data);
                setHasTest(data.has_test);
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        } catch (error) {
            console.error('Error while fetching datasets: ', error);
        }
    };

    const selectDataset = async (id) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/dataset", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "dataset": id })
            });

            if (response.status !== 200) {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error while selecting dataset: ', error);
        }
    };


    useEffect(() => {
        const load = async () => {
            const response = await fetch("http://127.0.0.1:5000/datasets", {
                mode: 'cors',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                const data = await response.json();
                setDatasets(data.datasets);

                // Only set selectedDatasetId if the model's dataset_id is in the list
                const defaultId = model?.loader?.dataset_id;
                console.log("Default Dataset ID: ", model.loader.dataset_id);
                const found = data.datasets.find(ds => ds.id === defaultId);
                if (found) {
                    setSelectedDatasetId(defaultId);
                    fetchDataset(defaultId);
                } else if (data.datasets.length > 0) {
                    setSelectedDatasetId(data.datasets[0].id);
                    fetchDataset(data.datasets[0].id);
                }
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        };
        load();
    }, []);

    const handleChange = async (e) => {
        const id = e.target.value;
        setSelectedDatasetId(id);
        selectDataset(id);
        await fetchDataset(id);
    };

    return (
        <div className="main-page">
            <h1>Dataset</h1>
            <p>
                This page allows you to select a dataset for the model. The selected dataset will be used for training and testing.
            </p>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                }}
            >
                {datasets.length > 0 && (
                    <FormControl style={{ flex: 1, marginRight: 16, maxWidth: "400px" }}>
                        <InputLabel id="dataset-select-label">Select Dataset</InputLabel>
                        <Select
                            labelId="dataset-select-label"
                            id="dataset-select"
                            label="Select Dataset"
                            value={selectedDatasetId}
                            onChange={handleChange}
                            disabled={model.state === "IN_TRAINING"}
                        >
                            {datasets.map((dataset) => (
                                <MenuItem key={dataset.id} value={dataset.id}>
                                    {dataset.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {/* <Button
                    variant="contained"
                    color="primary"
                    style={{
                        height: "40px",
                        minHeight: "40px",
                        minWidth: "150px",
                        width: "150px"
                    }}
                >
                    Add Dataset
                </Button> */}
            </div>
            <div className="dataset-details">
                {dataset ? (
                    <div>
                        <h3>Dataset Details</h3>
                        <div><strong>ID:</strong> {dataset.id}</div>
                        <div><strong>Name:</strong> {dataset.name}</div>
                        <div>
                            <strong>Number of Labels:</strong> {dataset.train_vocab ? dataset.train_vocab.length : 0}
                        </div>
                        <div><strong>Has Test Data:</strong> {dataset.has_test ? "Yes" : "No"}</div>
                        <div>
                            <strong>Label list ({dataset.train_vocab.length}): </strong>
                            <span>
                                {dataset.train_vocab && dataset.train_vocab.length > 0
                                    ? dataset.train_vocab.join(", ")
                                    : "None"}
                            </span>
                        </div>

                    </div>
                ) : (
                    <p>Select a dataset to view its details.</p>
                )}
            </div>
        </div>
    );
};

export default DatasetMainPage;