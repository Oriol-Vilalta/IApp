import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";



const DatasetList = ({ datasets, setActiveDataset }) => {
    
    return (
        <Box sx={{ maxWidth: 'auto', maxHeight: 540, overflowY: 'auto' }}>
            <List style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {datasets && datasets.map((dataset) => (
                    <ListItem key={dataset.id} disablePadding>
                        <ListItemButton
                            onMouseEnter={() => setActiveDataset(dataset)}
                            component="a"
                            href={`/datasets/${dataset.id}`}
                        >
                            <ListItemText
                                primary={dataset.name}
                                secondary={
                                    dataset.train_vocab.length === 0
                                        ? "NEW"
                                        : `${dataset.train_vocab.length} different classes`
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}


export default DatasetList;