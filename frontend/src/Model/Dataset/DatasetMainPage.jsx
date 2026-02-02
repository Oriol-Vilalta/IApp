import { useEffect, useState } from "react";
import "../MainPage.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Box } from "@mui/system";

const DatasetMainPage = ({ model, setHasTest }) => {
    const [datasets, setDatasets] = useState([]);
    const [dataset, setDataset] = useState(null);
    const [selectedDatasetId, setSelectedDatasetId] = useState("");
    const [pendingDatasetId, setPendingDatasetId] = useState("");
    const [confirmationMsg, setConfirmationMsg] = useState("");


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

                const defaultId = model?.loader?.dataset_id;
                const found = data.datasets.find(ds => ds.id === defaultId);
                if (found) {
                    setSelectedDatasetId(defaultId);
                    setPendingDatasetId(defaultId);
                    fetchDataset(defaultId);
                } else if (data.datasets.length > 0) {
                    setSelectedDatasetId(data.datasets[0].id);
                    setPendingDatasetId(data.datasets[0].id);
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
                setConfirmationMsg(errorData.message || "Failed to update dataset.");
            } else {
                setConfirmationMsg("Changes applied successfully.");
                setSelectedDatasetId(id);
                await fetchDataset(id);
            }
        } catch (error) {
            setConfirmationMsg("Error while selecting dataset.");
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

                const defaultId = model?.loader?.dataset_id;
                const found = data.datasets.find(ds => ds.id === defaultId);
                if (found) {
                    setSelectedDatasetId(defaultId);
                    setPendingDatasetId(defaultId);
                    fetchDataset(defaultId);
                } else if (data.datasets.length > 0) {
                    setSelectedDatasetId(data.datasets[0].id);
                    setPendingDatasetId(data.datasets[0].id);
                    fetchDataset(data.datasets[0].id);
                }
            } else {
                console.error('Error fetching datasets: ', response.statusText);
            }
        };
        load();
    }, []);

    const handleChange = (e) => {
        setPendingDatasetId(e.target.value);
        setConfirmationMsg("");
    };

    const handleApply = async () => {
        await selectDataset(pendingDatasetId);
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
                    gap: 16,
                    maxWidth: 600,
                    marginBottom: 16
                }}
            >
                {datasets.length > 0 && (
                    <FormControl style={{ flex: 1, maxWidth: "400px" }}>
                        <InputLabel id="dataset-select-label">Select Dataset</InputLabel>
                        <Select
                            labelId="dataset-select-label"
                            id="dataset-select"
                            label="Select Dataset"
                            value={pendingDatasetId}
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
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        height: "40px",
                        minHeight: "40px",
                        minWidth: "120px",
                        width: "120px"
                    }}
                    onClick={handleApply}
                    disabled={
                        !pendingDatasetId ||
                        model.state === "IN_TRAINING"
                    }
                >
                    Apply
                </Button>
            </div>
            {confirmationMsg && (
                <div style={{ marginTop: 16, color: "#388e3c", fontWeight: 500 }}>
                    {confirmationMsg}
                </div>
            )}
            <div className="dataset-details" style={{ marginTop: 32, maxWidth: 600 }}>
                {dataset ? (
                    <Card sx={{ background: "#f9f9fb", boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Dataset Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", rowGap: 10, columnGap: 16 }}>
                                <Typography sx={{ fontWeight: 500 }}>ID:</Typography>
                                <Typography color="text.secondary">{dataset.id}</Typography>
                                <Typography sx={{ fontWeight: 500 }}>Name:</Typography>
                                <Typography color="text.secondary">{dataset.name}</Typography>
                                <Typography sx={{ fontWeight: 500 }}>Number of Labels:</Typography>
                                <Typography color="text.secondary">{dataset.train_vocab ? dataset.train_vocab.length : 0}</Typography>
                                <Typography sx={{ fontWeight: 500 }}>Has Test Data:</Typography>
                                <Typography color="text.secondary">{dataset.has_test ? "Yes" : "No"}</Typography>
                                <Typography sx={{ fontWeight: 500, alignSelf: "start" }}>Label List:</Typography>
                                <Box>
                                    {dataset.train_vocab && dataset.train_vocab.length > 0 ? (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {dataset.train_vocab.map((label, idx) => (
                                                <Box
                                                    key={label}
                                                    sx={{
                                                        px: 1.5,
                                                        py: 0.5,
                                                        background: "#e3e6f0",
                                                        borderRadius: 2,
                                                        fontSize: 14,
                                                        mb: 0.5,
                                                        mr: 0.5,
                                                        color: "#333",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {label}
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary">None</Typography>
                                    )}
                                </Box>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography sx={{ mt: 2 }} color="text.secondary">
                        Select a dataset to view its details.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default DatasetMainPage;