import { createTheme, responsiveFontSizes } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: 'rgb(30,30,30)'
        }
    }
});

export default responsiveFontSizes(theme);