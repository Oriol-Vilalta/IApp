import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CreateModelModal = ({ showCreateModel, setShowCreateModel }) => {
    const [modelName, setModelName] = React.useState('');
    
    const onCreate = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/models', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: modelName })
            });

            if (response.status === 201) {
                setShowCreateModel(false);
            } else if (response.status === 400) {
                console.error('Model already exists');
            }
        } catch (error) {
            console.error('Error creating model:', error);
        };
    }

    return (
        <Dialog
            open={showCreateModel}
            onClose={() => setShowCreateModel(false)}
            PaperProps={{
                style: {
                    width: 400,
                    maxWidth: '90vw',
                    borderRadius: 12,
                },
            }}
        >
            <DialogTitle>Create Model</DialogTitle>
            <DialogContent>
                <div>
                    <TextField
                        className='model-name-input'
                        id="model-name-input"
                        value={modelName}
                        onChange={e => setModelName(e.target.value)}
                        style={{ width: '100%', marginTop: 8, marginBottom: 8 }}
                        multiline
                        minRows={1}
                        variant="outlined"
                        placeholder="Enter model name"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setShowCreateModel(false)}
                    color="error"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await onCreate(modelName);
                    }}
                    disabled={!modelName.trim()}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateModelModal;