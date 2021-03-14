import RobotoMedium from './fonts/Roboto-Medium.woff2';
import RobotoBold from './fonts/Roboto-Bold.woff2';
import RobotoRegular from './fonts/Roboto-Regular.woff2';
import RobotoLight from './fonts/Roboto-Light.woff2';
import RobotoExtraLight from './fonts/Roboto-ExtraLight.woff2';
import SourceSansProRegular from './fonts/SourceSansPro-Regular.woff2';
import SourceSansProLight from './fonts/SourceSansPro-Light.woff2';
import SourceSansProExtraLight from './fonts/SourceSansPro-ExtraLight.woff2';

export const robotoMedium = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 500,
    src: `
      local('Roboto'),
      local('Roboto-Medium'),
      url(${RobotoMedium}) format('woff2')
    `,
};
  
export const robotoBold = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 700,
    src: `
        local('Roboto'),
        local('Roboto-Bold'),
        url(${RobotoBold}) format('woff2')
        `,
};
  
export const robotoRegular = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
        local('Roboto'),
        local('Roboto-Regular'),
        url(${RobotoRegular}) format('woff2')
      `,
};
  
export const robotoLight = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 300,
    src: `
        local('Roboto'),
        local('Roboto-Light'),
        url(${RobotoLight}) format('woff2')
      `,
};
  
export const robotoExtraLight = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 200,
    src: `
        local('Roboto'),
        local('Roboto-ExtraLight'),
        url(${RobotoExtraLight}) format('woff2')
      `,
};
  
export const sourceSansProRegular = {
    fontFamily: 'SourceSansPro',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
        local('SourceSansPro'),
        local('SourceSansPro-Regular'),
        url(${SourceSansProRegular}) format('woff2')
      `,
};
  
export const sourceSansProLight = {
    fontFamily: 'SourceSansPro',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 300,
    src: `
        local('SourceSansPro'),
        local('SourceSansPro-Light'),
        url(${SourceSansProLight}) format('woff2')
      `,
};
  
export const sourceSansProExtraLight = {
    fontFamily: 'SourceSansPro',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 200,
    src: `
        local('SourceSansPro'),
        local('SourceSansPro-ExtraLight'),
        url(${SourceSansProExtraLight}) format('woff2')
      `,
};