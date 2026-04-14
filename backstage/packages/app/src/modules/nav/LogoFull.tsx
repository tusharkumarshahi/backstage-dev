import { makeStyles } from '@material-ui/core';
import medicaIcon from '../../branding/medica-icon.png';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: 30,
  },
  icon: {
    height: 28,
    width: 'auto',
    maxWidth: 120,
    objectFit: 'contain',
    flexShrink: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2C3E50',
    letterSpacing: '-0.5px',
  },
});

export const LogoFull = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={medicaIcon} alt="Medica" className={classes.icon} />
      <span className={classes.text}>Medica</span>
    </div>
  );
};
