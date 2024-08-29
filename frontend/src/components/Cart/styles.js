import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  title: {
    marginTop: '5%',
  },
  emptyButton: {
    minWidth: '150px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '5px',
    },
    [theme.breakpoints.up('xs')]: {
      marginRight: '20px',
    },
  },
  checkoutButton: {
    minWidth: '150px',
  },
  link: {
    textDecoration: 'none',
  },
  cardDetails: {
    display: 'flex',
    marginTop: '10%',
    width: '100%',
    justifyContent: 'space-between',
  },
  successAlert: {
    backgroundColor: theme.palette.success.main, // Use the theme's success color
    color: theme.palette.getContrastText(theme.palette.success.main), // Ensure text contrast
    borderRadius: '8px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    '& .MuiAlert-icon': { // Target the Alert's icon
      color: theme.palette.getContrastText(theme.palette.success.main),
    },
}));