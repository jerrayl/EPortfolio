import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    portfolioList: {
      padding: '5px !important',
      display: 'flex',
      alignItems: 'stretch'
    },
    portfolioCardHeader: {
      padding: '0px',
      flexGrow: 1
    },
    cardHeaderAction: {
      textAlign: 'right',
    },
    buttomBaseRoot: {
      backgroundColor: '#333333',
      opacity: '66%',
    },
    portfolioListItem: {
      width: '33% !important',
      height: 'initial !important',
      paddingLeft: '10px !important'
    },
    portfolioCard: {
      boxShadow: 'initial',
      backgroundColor: 'inherit'
    },
    cardContent: {
      display: 'flex',
      alignItems: 'center'
    },
    cardContentTypo: {
      flexGrow: 4
    },
    portfolioCardMenu: {
      width: '20%',
    },
    menuPaperRoot: {
      width: '100%',
    },
    cardThumbnail: {
      width: '100%',
    },
    cardMediaRoot: {
      height: '10px',
      padding: '100%',
    },
    copyLinkPaperRoot: {
      width: '40%',
      padding: '50px 20px',
      margin: 'auto',
      position: 'absolute',
      top: '35% !important',
      left: '32% !important',
    },
    popoverContents: {
      display: 'block',
      margin: 'auto',
      marginTop: '20px',
    },
    textarea: {
      width: '85% !important',
    },
    category: {
      display: 'inline-table',
    },
    categoryTypography: {
      display: 'table-cell',
    },
    categoryDiv: {
      display: 'table-cell',
      width: '100%',
    },
    categoryLine: {
      marginBottom: '5px',
    },
    top: {
      display: 'flex'
    },
    topTypo: {
      flexGrow: 6
    },
    topButton: {
      flexGrow: 1,
      height: 'fit-content'
    }
  }));

  export default useStyles;