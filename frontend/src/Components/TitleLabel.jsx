import Typography from '@mui/material/Typography';
import "./TitleLabel.css";

function TitleLabel({ text, amount }) {
    return (
        <div className="main-page-title" style={{ display: 'flex', alignItems: 'center' }}>
            <Typography
                variant="h4"
                component="div"
                sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', marginRight: 2 }}
            >
                {text}
            </Typography>
            {amount !== 0 && (
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
                >
                    {amount}
                </Typography>
            )}
        </div>
    );
}

export default TitleLabel;