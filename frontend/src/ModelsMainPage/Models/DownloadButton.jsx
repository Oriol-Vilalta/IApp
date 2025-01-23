import {Button} from "@mui/material";


const DownloadButton = ({object, type}) => {

    const download = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/' + type + '/' + object.id + '/download', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = object.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('There was an error!', error);
        }

    }


    return <Button
        variant="contained"
        onClick={(e) => {download(e)}}
    >
        DOWNLOAD
    </Button>
}

export default DownloadButton;