import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const CreateModelModal = ({ showCreateModel, setShowCreateModel }) => {
    const [modelName, setModelName] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

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
                setErrorMsg('');
                setModelName('');
            } else if (response.status === 400) {
                setErrorMsg('This name is already in use');
            }
        } catch (error) {
            console.log('Error creating model:', error);
        }
    };

    const handleClose = () => {
        setShowCreateModel(false);
        setErrorMsg('');
        setModelName('');
    };

    return (
        <Dialog
            open={showCreateModel}
            onClose={handleClose}
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
                        onChange={e => {
                            setModelName(e.target.value);
                            setErrorMsg('');
                        }}
                        style={{ width: '100%', marginTop: 8, marginBottom: 8 }}
                        multiline
                        minRows={1}
                        variant="outlined"
                        placeholder="Enter model name"
                        error={!!errorMsg}
                    />
                    {errorMsg && (
                        <Typography color="error" variant="body2" style={{ marginTop: 4 }}>
                            {errorMsg}
                        </Typography>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="error"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onCreate}
                    disabled={!modelName.trim()}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateModelModal;