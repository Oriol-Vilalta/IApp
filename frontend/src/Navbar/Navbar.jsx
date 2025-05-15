import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const pages = ['models', 'datasets'];


function Navbar() {

return (
    <AppBar position="static">
        <Container maxWidth="100%">
            <Toolbar disableGutters>
            
                <Box sx={{ display: { xs: 'none', md: 'flex' }, }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            href={`/${page}`}
                            sx={{ 
                                my: 2, 
                                color: 'white', 
                                display: 'block', 
                                fontSize: 20, 
                                fontWeight: 'bold' 
                            }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                
            </Toolbar>
        </Container>
    </AppBar>
);

}
export default Navbar;