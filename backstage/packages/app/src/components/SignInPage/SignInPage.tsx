import { SignInPage as BackstageSignInPage } from '@backstage/core-components';
import { IdentityApi, ApiRef, OAuthApi, OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionApi } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import medicaIcon from '../../branding/medica-icon.png';

interface SignInProviderConfig {
  id: string;
  title: string;
  message: string;
  apiRef: ApiRef<OAuthApi & OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi>;
}

interface MedicaSignInPageProps {
  providers?: (string | SignInProviderConfig)[];
  onSignInSuccess: (identityApi: IdentityApi) => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8F3F2 0%, #FDFBFB 100%)',
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(5),
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: '14px 20px',
    boxShadow: '0 2px 12px rgba(52, 81, 129, 0.1)',
    marginBottom: theme.spacing(3),
  },
  logo: {
    width: 180,
    height: 'auto',
    display: 'block',
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: '#345181',
    marginBottom: theme.spacing(2),
    letterSpacing: '-0.5px',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  subtitle: {
    fontSize: 17,
    color: '#6E6B71',
    textAlign: 'center',
    maxWidth: 520,
    lineHeight: 1.7,
    fontFamily: '"Lato", system-ui, sans-serif',
  },
  signInBox: {
    background: 'white',
    borderRadius: 16,
    padding: theme.spacing(4),
    boxShadow: '0 10px 40px rgba(52, 81, 129, 0.1)',
    minWidth: 450,
    maxWidth: 500,
    // Hide Backstage's default teal header
    '& header': {
      display: 'none !important',
    },
    '& [class*="header"]': {
      display: 'none !important',
    },
    '& > div > div:first-child': {
      display: 'none !important',
    },
    '& button': {
      borderRadius: 8,
      padding: '12px 24px',
      fontSize: 16,
      fontWeight: 500,
      textTransform: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(203, 23, 102, 0.2)',
      },
    },
  },
}));

export const MedicaSignInPage = (props: MedicaSignInPageProps) => {
  const classes = useStyles();
  const { providers = [], onSignInSuccess } = props;

  return (
    <div className={classes.container}>
      <Box className={classes.header}>
        <div className={classes.logoContainer}>
          <img src={medicaIcon} alt="Medica" className={classes.logo} />
        </div>
        <Typography className={classes.title}>
          Medica Developer Platform
        </Typography>
        <Typography className={classes.subtitle}>
          Welcome to the Medica platform. Sign in to access developer tools,
          documentation, and services.
        </Typography>
      </Box>
      <Box className={classes.signInBox}>
        <BackstageSignInPage
          providers={providers as any}
          onSignInSuccess={onSignInSuccess}
        />
      </Box>
    </div>
  );
};
