import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
 

const ModelList = ({ models, setActiveModel }) => {
    
    return (
        <Box sx={{ maxWidth: 'auto', maxHeight: 540, overflowY: 'auto' }}>
            <List style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            {models && models.map((model) => (
                <ListItem key={model.id} disablePadding>
                    <ListItemButton
                        onMouseEnter={() => setActiveModel(model)}
                        component="a"
                        href={`/models/${model.id}`}
                    >
                        <ListItemText primary={model.name} secondary={`${model.state}`} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Box>
    );
}


export default ModelList;