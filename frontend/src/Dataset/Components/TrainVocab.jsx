import { List } from '@mui/material';
import Button from '@mui/material/Button';
import VocabElement from './VocabElement';
import React, { useRef } from 'react';

const TrainVocabList = ({ dataset }) => {
    const fileInputRef = useRef();

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete all the training data?`)) {
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000" + "/datasets/" + dataset.id + "/delete/train", {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error(`Failed to delete training data: `, response.statusText);
            }
        } catch (error) {
            console.error(`Error while deleting training data: `, error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://127.0.0.1:5000/datasets/${dataset.id}/upload/train`, {
                method: 'POST',
                body: formData,
            });
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error('Failed to upload training data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while uploading training data:', error);
        }
    };

    if(dataset.train_vocab.length === 0) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0 }}>Training Data</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Upload Training Data
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleUpload}
                        />
                    </div>
                </div>
                <p>No training data available.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
                <h2 style={{ paddingLeft: 10 }}>Training Data</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        color="error"
                        variant="contained"
                        aria-label="delete"
                        onClick={handleDelete}
                    >
                        Delete Training Data
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload Training Data
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />
                </div>
            </div>
            {dataset.has_test_used_training_data && <p>Generated using training data</p>}
            <List>
                {dataset.train_vocab.map((vocab, index) => (
                    <VocabElement label={vocab} id={dataset.id} vocabKey={index} key={index} mode={"train"}/>
                ))}
            </List>
        </div>
    );
};

export default TrainVocabList;