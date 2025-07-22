'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#FFFFFF',
        },
        secondary: {
            main: '#f50057',
        },
        headTypography: {
            main: '#0A1929'
        },
        ticketBox: {
            main: '#EBECF0'
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            ms: 479,
            sm: 600,
            nineS: 900,
            md: 1090,
            lg: 1200,
            fl: 1350,
            xl: 1556,
        },
    }
});



export default function ClientLayout({ children }) {
    // You can now use hooks, state, effects, etc. here
    return <>
        <ThemeProvider theme={theme} >
            <CssBaseline />
            {children}
        </ThemeProvider>
    </>;
}
