import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 300;

export const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'space-between',
    },
    content: {
      backgroundColor: theme.palette.primary.main,
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
    textinput: { 
      marginLeft: theme.spacing(2),
      margin: theme.spacing(1),
      width: '30ch',
    },
    indented: { 
      marginLeft: theme.spacing(2),
    },
    cardRoot: {
      minWidth: 275,
      boxShadow: 'none',
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 2
    },
    unflex: {
      flex: '0 1 7em',
    },
    pos: {
      marginTop: '2em',
      marginBottom: 12,
    },
    media: {
      padding:'20vh'
    },
    titleText:{
      fontSize: '1.5rem'
    },
    addRow:{
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block'
    },
    addCol:{
      position: 'absolute',
      top: '-50%',
      right: '-5em',
    },
    wrapper:{
      position: 'relative',
      height: '100%', 
      width: '100%'
    },
    addIcon:{
      fontSize: '3.5rem'  
    },
    inline:{
      display:'inline-flex'
    },
    inlineTextInput:{
      margin: theme.spacing(1)
    },
    socialLinks:{      
      display: 'flex',
      alignItems: 'center'
    },
    socialMedia:{
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
      fontSize: '20px',
      color: 'white',
      padding: theme.spacing(2),
    },
    currentPage:{
      fontWeight: 'bold'
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    themeItem: {
      display: 'block',
    },
    select: {
      minWidth: '80%',
      marginLeft: '10px',
      marginRight: '10px'
    },
    contentPadding: {
      paddingTop: '20px !important',
      paddingBottom: '20px !important',
      paddingLeft: '10% !important',
    },
    primaryColor: {
      backgroundColor: theme.palette.primary.main
    },
    secondaryColor: {
      backgroundColor: theme.palette.secondary.main
    },
    textSecondary: {
      color: theme.palette.secondary.contrastText
    },
    cardActions: {
      paddingLeft: theme.spacing(2),
      justifyContent: 'space-between',
      backgroundColor: theme.palette.primary.main,
      flexGrow: 2
    },
    gridPadding: {
      paddingLeft: '10% !important',
      paddingRight: '10% !important',
    },
    cardPadding: {
      paddingTop: '20px !important',
      paddingBottom: '20px !important',
      
    },
    gridItem: {
      display: 'grid',
      padding: '12px'
    },
    items: {
      marginLeft: '-12px'
    },
    addItem: {
      display: 'block'
    },
    row: {
      display: 'flex',
      flexGrow: 4
    },
    iconButton: {
      display: 'contents'
    },
    cardGroup: {
      display: 'flex'
    },
    accordionDetails:{
      display: 'block',
      padding: 0
    },
    drawerPadding: {
      paddingLeft: '10px'
    },
    displayColor: {
      width: '20px',
      height: '20px'
    }
  }));