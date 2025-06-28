import "./VocabElement.css";
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

const VocabElement = ({ label, id, vocabKey, mode }) => {

    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the label "${capitalizedLabel}" and all its images?`)) {
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000" + "/datasets/" + id + "/delete/label?name=" + label, {
                mode: 'cors',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error(`Failed to delete label "${capitalizedLabel}":`, response.statusText);
            }
        } catch (error) {
            console.error(`Error while deleting label "${capitalizedLabel}":`, error);
        }

    };

    return (
        <ListItem key={vocabKey} className="vocab-list-item">
            <ListItemAvatar>
                <Avatar
                    variant="square"
                    src={`http://127.0.0.1:5000/datasets/${id}/image/${mode}/${label}`}
                    alt={capitalizedLabel}
                    sx={{ width: 70, height: 70, marginRight: 2 }}
                />
            </ListItemAvatar>
            <ListItemText primary={capitalizedLabel} />
            <ListItemAvatar>
                <Button
                    edge="start"
                    color="error"
                    variant="contained"
                    aria-label="delete"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </ListItemAvatar>
        </ListItem>
    );
};

export default VocabElement;