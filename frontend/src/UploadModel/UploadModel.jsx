import './UploadModel.css'
import {useState} from 'react'


function UploadModel() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if(!file) {
            alert("No file uploaded");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:5000/models/upload`, {
               method: "POST",
               body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('File uploaded successfully', result);
                alert('File uploaded successfully');
            } else {
                console.error('File upload failed', response.statusText);
                alert('File upload failed');
            }
        } catch (error) {
            console.error('Error uploading file', error);
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default UploadModel;