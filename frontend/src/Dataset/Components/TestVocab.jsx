import { List } from '@mui/material';
import Button from '@mui/material/Button';
import VocabElement from './VocabElement';
import React, { useRef } from 'react';
import GeneratTestModal from './GenerateTestModal';

const TestVocabList = ({ dataset }) => {
    const fileInputRef = useRef();

    const [showGenerateModal, setShowGenerateModal] = React.useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete all the testing data?`)) {
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000" + "/datasets/" + dataset.id + "/delete/test", {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error(`Failed to delete testing data: `, response.statusText);
            }
        } catch (error) {
            console.error(`Error while deleting testing data: `, error);
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://127.0.0.1:5000/datasets/${dataset.id}/upload/test`, {
                method: 'POST',
                body: formData,
            });
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error('Failed to upload testing data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while uploading testing data:', error);
        }
    };

    if(dataset.test_vocab.length === 0) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0 }}>Testing Data</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => setShowGenerateModal(true)}
                        >
                            Generate Testing Data
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Upload Testing Data
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleUpload}
                        />
                    </div>
                </div>
                <p>No testing data available.</p>
                <GeneratTestModal datasetId={dataset.id} 
                    showGenerateTestModel={showGenerateModal} 
                    setShowGenerateTestModal={setShowGenerateModal} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'space-between' }}>
                <h2 style={{ paddingLeft: 10 }}>Testing Data</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                        color="error"
                        variant="contained"
                        aria-label="delete"
                        onClick={handleDelete}
                    >
                        Delete Testing Data
                    </Button>  
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload Testing Data
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />
                </div>
            </div>
            <List>
                {dataset.test_vocab.map((vocab, index) => (
                    <VocabElement label={vocab} id={dataset.id} vocabKey={index} key={index} mode={"test"}/>
                ))}
            </List>
        </div>
    );
};

export default TestVocabList;