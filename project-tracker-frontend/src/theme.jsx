import { createTheme, responsiveFontSizes } from '@mui/material';

const darkTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: 'rgb(30,30,30)'
        },
        thirdly: { main: '#6c7276' }
    }
}));

const lightTheme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'light',
        thirdly: { main: '#6c727678' }
    }
}));

// const lightCard = responsiveFontSizes(createTheme({
//     palette: {
//         mode: 'lightCard',
//         background: {
//             default: 
//         }
//     }
// }));

// const darkCard = responsiveFontSizes(createTheme({
//     palette: {
//         mode: 'darkCard',
//         background: {
//         }
//     }
// }));

export { darkTheme, lightTheme };