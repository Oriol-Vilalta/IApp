import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const CreateDatasetModal = ({ showCreateDataset, setShowCreateDataset }) => {
    const [datasetName, setDatasetName] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

    const onCreate = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/datasets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: datasetName })
            });

            if (response.status === 201) {
                setShowCreateDataset(false);
                setErrorMsg('');
                setDatasetName('');
            } else if (response.status === 400) {
                setErrorMsg('This name is already in use');
            }
        } catch (error) {
            console.log('Error creating dataset:', error);
        }
    };

    const handleClose = () => {
        setShowCreateDataset(false);
        setErrorMsg('');
        setDatasetName('');
    };

    return (
        <Dialog
            open={showCreateDataset}
            onClose={handleClose}
            PaperProps={{
                style: {
                    width: 400,
                    maxWidth: '90vw',
                    borderRadius: 12,
                },
            }}
        >
            <DialogTitle>Create Dataset</DialogTitle>
            <DialogContent>
                <div>
                    <TextField
                        className='dataset-name-input'
                        id="dataset-name-input"
                        value={datasetName}
                        onChange={e => {
                            setDatasetName(e.target.value);
                            setErrorMsg('');
                        }}
                        style={{ width: '100%', marginTop: 8, marginBottom: 8 }}
                        multiline
                        minRows={1}
                        variant="outlined"
                        placeholder="Enter dataset name"
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
                    disabled={!datasetName.trim()}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDatasetModal;