import "../MainPage.css";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const PredictMainPage = ({ model }) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [graphKey, setGraphKey] = useState(Date.now());
    const [predictionResult, setPredictionResult] = useState(null);

    const handleFileChange = e => {
        const file = e.target.files[0];
        setSelectedFile(file || null);
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                const img = document.getElementById('preview-img');
                if (img) img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
        setPredictionResult(null);
    };

    const loadHeatmap = async () => {
        const heatmapImg = document.getElementById('heatmap-img');
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/models/${model.id}/heatmap`, {
                method: "GET",
                mode: "cors",
            });
            
            if (response.status === 200) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                heatmapImg.src = url;
            }
        } catch (error) {
            console.error("Error loading heatmap:", error);
        }
    };

    const handlePredictClick = async () => {
        const file = selectedFile;
        if (!file) {
            alert("Please upload an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + "/predict?prob_graph=true", {
                method: "POST",
                body: formData,
                mode: "cors",
            });

            if(response.status === 200) {
                const data = await response.json();
                setPredictionResult(data.result);
                setGraphKey(Date.now());
                loadHeatmap();
            } else {
                alert("Prediction failed. Please try again. Status: " + (await response.json())['error']);
            }
        } catch (error) {
            console.error("Error during prediction:", error);
        }
    };

    return (
        <div className="main-page">
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Predict Main Page
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Upload an image and get a prediction from your model.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Card sx={{ flex: 1, minWidth: 340, maxWidth: 400, p: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Upload and Preview Image
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => inputRef.current && inputRef.current.click()}
                        >
                            Upload Image
                        </Button>
                        <Box
                            sx={{
                                mt: 2,
                                width: 1,
                                height: 300,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "#fafbfc",
                            }}
                        >
                            <img
                                id="preview-img"
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '290px', display: selectedFile ? 'block' : 'none' }}
                            />
                            {!selectedFile && (
                                <Typography color="text.secondary" align="center">
                                    No image selected
                                </Typography>
                            )}
                        </Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                            fullWidth
                            onClick={handlePredictClick}
                            disabled={!selectedFile}
                        >
                            Predict
                        </Button>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 340, p: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Results
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {predictionResult ? (
                            <Box sx={{ mb: 2 }}>
                                <strong>Prediction Result:</strong>
                                <pre style={{ background: '#f5f5f5', padding: '1em', borderRadius: '4px', marginTop: 8 }}>
                                    {JSON.stringify(predictionResult, null, 2)}
                                </pre>
                            </Box>
                        ) : (
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                No prediction yet.
                            </Typography>
                        )}
                        <Box sx={{ mb: 2 }}>
                            <strong>Probability Graph:</strong>
                            {predictionResult ? (
                                <img
                                    id="prob-graph-img"
                                    alt="Probability Graph"
                                    style={{ maxWidth: '100%', maxHeight: '300px', display: 'block', marginTop: '1em', background: '#f5f5f5', borderRadius: '4px', padding: '1em' }}
                                    src={`http://127.0.0.1:5000/models/${model.id}/graphic?key=${graphKey}`}
                                />
                            ) : (
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    No probability graph yet.
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <strong>Heatmap:</strong>
                            {predictionResult ? (
                                <pre style={{ background: '#f5f5f5', padding: '1em', borderRadius: '4px', marginTop: 8 }}>
                                    <img
                                        id="heatmap-img"
                                        alt="Prediction Heatmap"
                                        style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }}
                                        src={`http://127.0.0.1:5000/models/${model.id}/gradcam`}
                                    />
                                </pre>
                            ) : (
                                <Typography color="text.secondary" align="center">
                                    No heatmap available.
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default PredictMainPage;