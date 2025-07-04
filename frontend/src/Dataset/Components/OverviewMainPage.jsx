import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Overview = ({ dataset }) => {
    if (!dataset) {
        return <div>No dataset selected.</div>;
    }

    const onDelete = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this dataset?")) {
                return;
            }
            const response = await fetch("http://127.0.0.1:5000/datasets/" + dataset.id, {
                method: "DELETE",
                mode: 'cors',
            });
        
            if (response.ok) {
                window.location.href = "/datasets";
            } else {
                alert("Failed to delete dataset.");
            }
        } catch (error) {
            console.error("Error deleting dataset:", error);
        }
    }

    const onDownload = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/datasets/" + dataset.id + '/download', {
                method: "GET",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download dataset");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = dataset.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        
        } catch (error) {
            console.error("Error downloading dataset:", error);
        }
    }

    // New grid card design for vocab lists
    const renderVocabSection = (title, vocabList, type) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
            {vocabList && vocabList.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        background: '#f7f7fa',
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                    }}
                >
                    {vocabList.slice(0, 8).map((vocab, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                width: 90,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: '#fff',
                                borderRadius: 2,
                                boxShadow: 2,
                                p: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <img
                                src={`http://127.0.0.1:5000/datasets/${dataset.id}/image/${type}/${vocab}`}
                                alt={`${type} ${vocab}`}
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    border: '1px solid #ccc',
                                    background: '#fafbfc'
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, textAlign: 'center' }}>
                                {vocab}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography color="text.secondary" sx={{ ml: 1 }}>
                    No {type} vocabulary available.
                </Typography>
            )}
        </Box>
    );

    return (
        <div className="dataset-overview" style={{ paddingLeft: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Dataset Overview</h2>
                <div>
                    <Button
                        variant="contained"
                        color="error"
                        style={{ marginRight: 8 }}
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
                </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>ID:</strong> {dataset.id}</li>
                <li>
                    {renderVocabSection("Training Vocabulary", dataset.train_vocab, "train")}
                </li>
                <li>
                    {renderVocabSection("Testing Vocabulary", dataset.test_vocab, "test")}
                </li>
            </ul>
        </div>
    );
};

export default Overview;