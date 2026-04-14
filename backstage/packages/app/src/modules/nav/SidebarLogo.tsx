import {
  Link,
} from '@backstage/core-components';
import { makeStyles } from '@material-ui/core';
import medicaIcon from '../../branding/medica-icon.png';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: '100%',
    height: 120,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    padding: '24px 16px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    height: 'auto',
    width: '100%',
    maxWidth: '100%',
    maxHeight: 40,
    objectFit: 'contain',
    display: 'block',
    opacity: 0.9,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 1,
    },
  },
});

export const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        <img src={medicaIcon} alt="Medica" className={classes.logo} />
      </Link>
    </div>
  );
};
