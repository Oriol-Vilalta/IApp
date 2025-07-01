import React from 'react';
import Button from '@mui/material/Button';

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

    return (
        <div className="dataset-overview">
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
            <ul>
                <li><strong>Name:</strong> {dataset.name}</li>
                <li><strong>ID:</strong> {dataset.id}</li>
                <li>
                    <strong>Training:</strong>
                    {dataset.train_vocab && dataset.train_vocab.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: '8px', marginTop: '8px' }}>
                            {dataset.train_vocab.slice(0, 8).map((vocab, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img
                                        src={`http://127.0.0.1:5000/datasets/${dataset.id}/image/train/${vocab}`}
                                        alt={`Train ${vocab}`}
                                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                                    />
                                    <span style={{ marginTop: 4, fontSize: 12 }}>{vocab}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span> No training vocabulary available.</span>
                    )}
                </li>
                <li>
                    <strong>Testing:</strong>
                    {dataset.test_vocab && dataset.test_vocab.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: '8px', marginTop: '8px' }}>
                            {dataset.test_vocab.slice(0, 8).map((vocab, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img
                                        src={`http://127.0.0.1:5000/datasets/${dataset.id}/image/test/${vocab}`}
                                        alt={`Test ${vocab}`}
                                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                                    />
                                    <span style={{ marginTop: 4, fontSize: 12 }}>{vocab}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span> No test vocabulary available.</span>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Overview;