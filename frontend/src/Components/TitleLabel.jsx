import Typography from '@mui/material/Typography';


function TitleLabel({ text }) {
    return (
        <h1 className="main-page-title">
            <Typography
                variant="h4"
                component="div"
                sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
            >
                {text}
            </Typography>
        </h1>
    );
}

export default TitleLabel;