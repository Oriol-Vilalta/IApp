import React from 'react';
import Button from '@mui/material/Button';

const CreateObjectButton = ({ label, setShowCreateModel }) => {
    return (
        <Button
            variant="contained"
            type="button"
            onClick={() => setShowCreateModel(true)}
        >
            {label}
        </Button>
    );
};

export default CreateObjectButton;