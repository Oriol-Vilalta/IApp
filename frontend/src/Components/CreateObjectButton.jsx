import React from 'react';
import Button from '@mui/material/Button';

const CreateObjectButton = ({ label, setShowCreate }) => {
    return (
        <Button
            variant="contained"
            type="button"
            onClick={() => setShowCreate(true)}
        >
            {label}
        </Button>
    );
};

export default CreateObjectButton;