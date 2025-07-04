import "../MainPage.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const OverviewMainPage = ({ model }) => {
    if (!model) {
        return (
            <div className="main-page">
                <h1>Overview Main Page</h1>
                <p>No model loaded.</p>
            </div>
        );
    }

    const onDelete = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this model?")) {
                return;
            }
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id, {
                method: "DELETE",
                mode: 'cors',
            });

            if (response.ok) {
                window.location.href = "/models";
            } else {
                alert("Failed to delete model.");
            }
        } catch (error) {
            console.error("Error deleting model:", error);
        }
    };

    const onDownload = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/models/" + model.id + '/download', {
                method: "GET",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download model");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = model.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading model:", error);
        }
    };

    return (
        <div className="main-page" style={{ position: "relative" }}>
            <Box
                sx={{
                    position: "absolute",
                    top: 32,
                    right: 32,
                    display: "flex",
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                    onClick={onDelete}
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onDownload}
                >
                    Download
                </Button>
            </Box>
            
            <h1>{model.name}</h1>

            <Card sx={{ mb: 3, maxWidth: 500, background: "#f9f9fb", boxShadow: 2, pl: 2, pr: 2 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        General Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", rowGap: 1, columnGap: 2 }}>
                        <Typography sx={{ fontWeight: 500 }}>Model Name:</Typography>
                        <Typography color="text.secondary">{model.name}</Typography>
                        <Typography sx={{ fontWeight: 500 }}>Model ID:</Typography>
                        <Typography color="text.secondary">{model.id}</Typography>
                        <Typography sx={{ fontWeight: 500 }}>State:</Typography>
                        <Typography color="text.secondary">{model.state}</Typography>
                        <Typography sx={{ fontWeight: 500 }}>Last Accessed:</Typography>
                        <Typography color="text.secondary">{model.last_accessed}</Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Card sx={{ flex: 1, minWidth: 320, background: "#f9f9fb", boxShadow: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Loader Configuration
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 1, columnGap: 2 }}>
                            <Typography sx={{ fontWeight: 500 }}>Dataset ID:</Typography>
                            <Typography color="text.secondary">{model.loader.dataset_id}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Batch Size:</Typography>
                            <Typography color="text.secondary">{model.loader.bs}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Seed:</Typography>
                            <Typography color="text.secondary">{model.loader.seed}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Validation %:</Typography>
                            <Typography color="text.secondary">{model.loader.valid_pct * 100}%</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Transformation Type:</Typography>
                            <Typography color="text.secondary">{model.loader.item_tfms.type}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Transformation Size:</Typography>
                            <Typography color="text.secondary">{model.loader.item_tfms.size}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Resizing Method:</Typography>
                            <Typography color="text.secondary">{model.loader.item_tfms.resize_method}</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ flex: 1, minWidth: 320, background: "#f9f9fb", boxShadow: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Learner Configuration
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 1, columnGap: 2 }}>
                            <Typography sx={{ fontWeight: 500 }}>Type:</Typography>
                            <Typography color="text.secondary">{model.learner.type}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Epochs:</Typography>
                            <Typography color="text.secondary">{model.learner.epoch}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Learning Rate:</Typography>
                            <Typography color="text.secondary">{model.learner.lr}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Architecture:</Typography>
                            <Typography color="text.secondary">{model.learner.arch}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Training Time:</Typography>
                            <Typography color="text.secondary">{model.learner.training_time ?? "N/A"}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Test Accuracy:</Typography>
                            <Typography color="text.secondary">{model.learner.test_accuracy ?? "N/A"}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Test Loss:</Typography>
                            <Typography color="text.secondary">{model.learner.test_loss ?? "N/A"}</Typography>
                            <Typography sx={{ fontWeight: 500 }}>Learner Exists:</Typography>
                            <Typography color="text.secondary">{model.learner.learner_exists ? "Yes" : "No"}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default OverviewMainPage;