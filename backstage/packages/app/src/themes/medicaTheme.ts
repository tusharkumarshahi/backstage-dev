import {
  createBaseThemeOptions,
  createUnifiedTheme,
  genPageTheme,
  palettes,
  shapes,
} from '@backstage/theme';

export const medicaTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
      primary: {
        main: '#345181',
        light: '#4A6BA8',
        dark: '#1B3760',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0a9396',
        light: '#2db3b6',
        dark: '#005f73',
        contrastText: '#ffffff',
      },
      error: {
        main: '#AB001E',
        light: '#D4334A',
        dark: '#8A0018',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#7E5701',
        light: '#A67C1A',
        dark: '#5F4100',
        contrastText: '#ffffff',
      },
      info: {
        main: '#345181',
        light: '#4A6BA8',
        dark: '#1B3760',
        contrastText: '#ffffff',
      },
      success: {
        main: '#0A7305',
        light: '#2D9428',
        dark: '#065503',
        contrastText: '#ffffff',
      },
      background: {
        default: '#FFFFFF',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#22272D',
        secondary: '#6E6B71',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(0, 0, 0, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
      },
      navigation: {
        background: '#ffffff',
        indicator: '#CB1766',
        color: '#6E6B71',
        selectedColor: '#22272D',
      },
    },
  }),
  fontFamily: '"Lato", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    documentation: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave2 }),
    tool: genPageTheme({ colors: ['#1B3760', '#345181'], shape: shapes.round }),
    service: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    website: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    library: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    other: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    app: genPageTheme({ colors: ['#345181', '#1B3760'], shape: shapes.wave }),
    apis: genPageTheme({ colors: ['#1B3760', '#345181'], shape: shapes.wave2 }),
  },
  components: {
    // --- Buttons: Berry action color + pill shape ---
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none' as const,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#CB1766',
          '&:hover': {
            backgroundColor: '#A01252',
          },
          '&:active': {
            backgroundColor: '#8A0F46',
          },
        },
        outlinedPrimary: {
          color: '#CB1766',
          borderColor: '#CB1766',
          '&:hover': {
            backgroundColor: 'rgba(203, 23, 102, 0.04)',
            borderColor: '#A01252',
          },
        },
        textPrimary: {
          color: '#CB1766',
          '&:hover': {
            backgroundColor: 'rgba(203, 23, 102, 0.04)',
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    // --- Cards & Paper: radius-md (8px), client elevation ---
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)',
        },
        elevation2: {
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
        },
        elevation4: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
        },
        elevation8: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)',
        },
      },
    },
    // --- Inputs: radius-sm (4px) ---
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    // --- Chips/Tags: radius-full (pill) ---
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    // --- Table: dark navy header, white text ---
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#1B3760',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderBottom: 'none',
            '& a, & span, & .MuiTableSortLabel-root, & .MuiLink-root': {
              color: '#ffffff',
            },
            '& .MuiTableSortLabel-root:hover': {
              color: '#d7e8fe',
            },
            '& .MuiTableSortLabel-root.Mui-active': {
              color: '#ffffff',
              '& .MuiTableSortLabel-icon': {
                color: '#ffffff',
              },
            },
          },
          '& .MuiTableCell-head:first-of-type': {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          },
          '& .MuiTableCell-head:last-of-type': {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(52, 81, 129, 0.04)',
          },
        },
      },
    },
    // --- Tabs: Berry active indicator, dark text ---
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#CB1766',
          height: 3,
          borderRadius: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 400,
          color: '#6E6B71',
          '&.Mui-selected': {
            fontWeight: 700,
            color: '#22272D',
          },
          '&:hover': {
            fontWeight: 700,
            color: '#22272D',
          },
        },
      },
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: '"Lato", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Calluna", Times New Roman, Times, Baskerville, Georgia, serif',
      fontSize: '48px',
      fontWeight: 700,
      marginBottom: 16,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", Helvetica Neue, Helvetica, Tahoma, Ariel, Georgia, serif',
      fontSize: '36px',
      fontWeight: 700,
      marginBottom: 14,
    },
    h3: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: 12,
    },
    h4: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: 10,
    },
    h5: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: 8,
    },
    h6: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: 8,
    },
  },
});
