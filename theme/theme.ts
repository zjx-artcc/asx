'use client';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: "light",
                primary: {
                    main: '#3E8BCB',
                    contrastText: '#EDEDF5',
                },
            },
        },
        dark: {
            palette: {
                mode: "dark",
                primary: {
                    main: '#3E8BCB',
                    contrastText: '#EDEDF5',
                },
            }
        },
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#3E8BCB',
            contrastText: '#EDEDF5',
        }
    }
});

export default theme;