import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { robotoMedium,
  robotoBold,
  robotoRegular,
  robotoLight,
  robotoExtraLight,
  sourceSansProRegular,
  sourceSansProLight,
  sourceSansProExtraLight } from './fonts'

export const useThemeStyle = makeStyles((theme) => ({
  content: {
    padding: '80px 10% 80px'
  },
  half: {
    display: 'flex'
  },
  leftright: {
    width: '50%',
    margin: 'auto'
  },
  leftrightButton: {
    marginLeft: '10px'
  },
  gray1: {
    backgroundColor: '#333333'
  },
  gray2: {
    backgroundColor: '#4f4f4f'
  },
  gray3: {
    backgroundColor: '#828282'
  },
  gray4: {
    backgroundColor: '#bdbdbd'
  },
  gray5: {
    backgroundColor: '#e0e0e0'
  },
  gray6: {
    backgroundColor: '#f2f2f2'
  },
  black: {
    backgroundColor: '#191919'
  },
  fontg1: {
    color: '#333333'
  },
  fontg2: {
    color: '#4f4f4f'
  },
  fontg3: {
    color: '#828282'
  },
  fontg4: {
    color: '#bdbdbd'
  },
  fontg5: {
    color: '#e0e0e0'
  },
  fontg6: {
    color: '#f2f2f2'
  },
  buttonLabel: {
    padding: '5px 35px'
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#40D4FF',

    },
    secondary: {
      main: '#FFFFFF'
    },
  },
  typography: {
    fontFamily: 'Roboto, SourceSansPro, Helvetica, Arial',
    h1: {
      fontFamily: 'Roboto',
      fontWeight: 500,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '2.3rem',
    },
    h3: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '2rem',
    },
    h4: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      fontSize: '1.56rem',
    },
    h5: {
      fontFamily: 'Roboto',
      fontWeight: 300,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: 'Roboto',
      fontWeight: 200,
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontFamily: 'SourceSansPro',
      fontWeight: 300,
    },
    button: {
      fontFamily: 'SourceSansPro',
      fontWeight: 300,
    },
    body1: {
      fontFamily: 'SourceSansPro',
      fontWeight: 200,
    },
    body2: {
      fontFamily: 'SourceSansPro',
      fontWeight: 400
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          robotoBold,
          robotoMedium,
          robotoRegular,
          robotoLight,
          robotoExtraLight,
          sourceSansProRegular,
          sourceSansProLight,
          sourceSansProExtraLight,
        ],
      },
    },
  },
});



export default theme;
