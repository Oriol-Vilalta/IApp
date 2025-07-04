import "../MainPage.css";
import ResultsDisplay from "./ResultsDisplay";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";

const TestMainPage = ({ model, fetchModel }) => {
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        const url = "http://127.0.0.1:5000/models/" + model.id + "/test";
        const res = await fetch(url, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await res.json();
        setLoading(false);
        fetchModel(); 
    };

    return (
        <div className="main-page">
            <h1>Training Results and Testing</h1>
            <p>Review your model's performance and initiate new testing sessions from this page.</p>
            <ResultsDisplay model={model} />
            <h3>Testing</h3>
            <Card sx={{ maxWidth: 340, background: "#f8fafc", boxShadow: 2, p: 2, mt: 2 }}>
                <CardContent>
                    <Button
                        variant="contained"
                        onClick={runTests}
                        disabled={loading}
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        {loading ? "RUNNING..." : "RUN TESTING"}
                    </Button>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Tested Accuracy
                        </Typography>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                            {model.learner.test_accuracy != null
                                ? `${Math.round(model.learner.test_accuracy * 100)}%`
                                : "--"}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" color="text.secondary">
                            Tested Loss
                        </Typography>
                        <Typography variant="h4" color="error.main" fontWeight="bold">
                            {model.learner.test_loss != null
                                ? `${Math.round(model.learner.test_loss * 100)}%`
                                : "--"}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestMainPage;