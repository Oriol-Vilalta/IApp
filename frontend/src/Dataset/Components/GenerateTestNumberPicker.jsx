import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { useEffect } from 'react';


const GenerateTestNumberPicker = ({ percentage, setPercentage }) => {
    
    useEffect(() => {
        setPercentage(25);
    }, [setPercentage]);
    
    return (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Slider
                value={percentage}
                min={0}
                max={100}
                step={1}
                onChange={(e, newValue) => setPercentage(newValue)}
                aria-labelledby="generate-test-number-picker"
                sx={{ flex: 1, mr: 2 }}
            />
            <Box sx={{ minWidth: 40, ml: 2 }}>
                <span>{percentage}%</span>
            </Box>
        </Box>
    );
};

export default GenerateTestNumberPicker;