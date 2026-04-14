import { makeStyles } from '@material-ui/core';
import medicaIcon from '../../branding/medica-icon.png';

const useStyles = makeStyles({
  icon: {
    height: 28,
    width: 'auto',
    maxWidth: 40,
    objectFit: 'contain',
  },
});

export const LogoIcon = () => {
  const classes = useStyles();

  return <img src={medicaIcon} alt="Medica" className={classes.icon} />;
};
