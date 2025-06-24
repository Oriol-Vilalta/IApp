import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import GenerateTestNumberPicker from './GenerateTestNumberPicker';


const GenerateTestModal = ({ datasetId, showGenerateTestModel, setShowGenerateTestModal }) => {
    const [percentage, setPercentage] = React.useState(0);

    const onConfirm = async () => {
        if (percentage == 0) {
            setShowGenerateTestModal(false);
            return;
        }   
        
        if (!window.confirm(`The test data will be generated from the training data using training data. Are you sure?`)) {
            return;
        }

        console.log(percentage /100);

        try {
            const response = await fetch('http://127.0.0.1:5000/datasets/' + datasetId + '/generate/test?percentage=' + (percentage/100), {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                window.location.reload();
                setShowGenerateTestModal(false);
            }
        } catch (error) {
            console.log('Error generating tests:', error);
        }
    };

    const handleClose = () => {
        setShowGenerateTestModal(false);
        setPercentage(0);
    };

    return (
        <Dialog
            open={showGenerateTestModel}
            onClose={handleClose}
            PaperProps={{
                style: {
                    width: 400,
                    maxWidth: '90vw',
                    borderRadius: 12,
                },
            }}
        >
            <DialogTitle>Generate Test</DialogTitle>
            <DialogContent>
                <div>
                    <GenerateTestNumberPicker
                        percentage={percentage}
                        setPercentage={setPercentage}/>
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
                    onClick={onConfirm}
                >
                    Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenerateTestModal;