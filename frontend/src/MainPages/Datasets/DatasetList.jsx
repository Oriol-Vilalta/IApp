import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";



const DatasetList = ({ datasets, setActiveDataset }) => {
    
    return (
        <Box sx={{ maxWidth: 'auto' }}>
            <List style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            {datasets && datasets.map((dataset) => (
                <ListItem key={dataset.id} disablePadding>
                    <ListItemButton
                        onMouseEnter={() => setActiveDataset(dataset)}
                        component="a"
                        href={`/datasets/${dataset.id}`}
                    > 
                      <ListItemText primary={dataset.name} secondary={`ID: ${dataset.id}`} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Box>
    );
}


export default DatasetList;