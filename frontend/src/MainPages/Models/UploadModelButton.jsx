
import React from 'react';
import Button from '@mui/material/Button';

const UploadModelButton = () => {
    
    const handleUpload = () => {    
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip'; 
        input.onchange = async (event) => {
            const file = event.target.files[0];
            
            if (!file) {
                alert("No file selected.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch("http://127.0.0.1:5000/models/upload", {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json();
                    alert(`Model uploaded successfully: ${data.message}`);
                    window.location.reload(); 
                } else {
                    const errorData = await response.json();
                    alert(`Error uploading model: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error uploading model:', error);
                alert('An error occurred while uploading the model.');
            }
        }
        input.click();
    }
    
    
    return (
    <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload Model
    </Button>
    );
}

export default UploadModelButton;