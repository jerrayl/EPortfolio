import React, { useEffect } from 'react';
import { Typography, Box, List, ListItem, FormControlLabel, Checkbox, InputLabel, Select, MenuItem, FormControl, Button, createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';
import { useThemeStyle } from '../../styles/themes';
import { useStyles } from './editStyles';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import store from '../../store';
import { getFonts } from '../../actions/googleFonts';
import { getFontTheme, saveItemTheme, saveTheme } from '../../actions/eportfolio';
import PresetThemes from './PresetThemes';

import { SketchPicker } from 'react-color';

const PortfolioTheme = ({getFonts, fonts, saveTheme, theme, portfolioID, itemID, item, saveItemTheme, getFontTheme, fontTheme}) => {
    const classes = useStyles();
    const themeStyle = useThemeStyle();
    const [itemTheme, setItemTheme] = React.useState({});

    
    const [custom, setCustom] = React.useState(theme?true:false);
    const handleCustomChange = (event) => {
        setCustom(event.target.checked);
    }

    const [primaryFontFamily, setPrimaryFont] = React.useState('');
    const [secondaryFontFamily, setSecondaryFont] = React.useState('');
    const handlePrimaryFontFamilyChange = (event) => {
        setPrimaryFont(event.target.value);
    }

    const handleSecondaryFontFamilyChange = (event) => {
        setSecondaryFont(event.target.value);
    }

    const [primaryColor, setPrimaryColor] = React.useState('');
    const handlePrimaryColorChange = (color) => {
        setPrimaryColor(color.hex);
    }
    const [secondaryColor, setSecondaryColor] = React.useState('');
    const handleSecondaryColorChange = (color) => {
        setSecondaryColor(color.hex);
    }

    const [headerBackgroundColor, setHeaderBackgroundColor] = React.useState('');
    const handleHeaderBackgroundColorChange = (color) => {
        setHeaderBackgroundColor(color.hex);
    }

    const [selectedPresetColors, setSelectedPresetColors] = React.useState({});
    const handlePresetColorChange = (event) => {
        setSelectedPresetColors(PresetThemes.Colors[event.target.value]);
    }

    const [selectedPresetFonts, setSelectedPresetFonts] = React.useState({});
    const handlePresetFontChange = (event) => {
        setSelectedPresetFonts(PresetThemes.Fonts[event.target.value]);
        if (Object.keys(PresetThemes.Fonts[event.target.value]).length > 0){
            getFontTheme(PresetThemes.Fonts[event.target.value]);
        }
    }

    const checkEmpty = (obj) => {
        for (var key in obj) {
            if (obj[key] !== null && obj[key] != '')
                return false;
        }
        return true;
    }

    const checkEmptyTheme = (theme) => {
        if (theme && Object.keys(theme).length > 0)
        return checkEmpty(theme);
        else {
            return true;
        }
    }

    const checkEmptyVariables = () => {
        return (primaryFontFamily === '' || secondaryFontFamily === '' || primaryColor === '' || secondaryColor === '' || headerBackgroundColor === '');
    }

    const checkThemeEqualsVariables = (theme) => {
        if (!theme || Object.keys(theme).length === 0){
            return true;
        } 
        return (
            (theme.primaryFontFamily === primaryFontFamily) &&
            (theme.secondaryFontFamily === secondaryFontFamily) &&
            (theme.primaryColor === primaryColor) &&
            (theme.secondaryColor === secondaryColor) &&
            (theme.headerBackgroundColor === headerBackgroundColor)
        )
    }

    const setVariablesFromTheme = (theme) => {
        if (theme && Object.keys(theme).length > 0){
            setPrimaryFont(theme.primaryFontFamily);
            setSecondaryFont(theme.secondaryFontFamily);
            setPrimaryColor(theme.primaryColor);
            setSecondaryColor(theme.secondaryColor);
            setHeaderBackgroundColor(theme.headerBackgroundColor);
        }
        else if (!theme || Object.keys(theme).length === 0){
            setPrimaryFont('');
            setSecondaryFont('');
            setPrimaryColor('');
            setSecondaryColor('');
            setHeaderBackgroundColor('');
        }
    }

    if (Object.keys(theme).length !== 0 && checkEmptyVariables()){
        if (itemID === ''){
            setVariablesFromTheme(theme);
        }
    }

    useEffect(() => {
        if (fonts.length === 0) getFonts();
        if (itemID !== '' && !checkEmptyVariables() && checkEmptyTheme(itemTheme)){
            setVariablesFromTheme(null);
        }
        else if (itemID !== '' && !checkThemeEqualsVariables(itemTheme)){
            setVariablesFromTheme(itemTheme);
        }
        else if (itemID === '' && !checkThemeEqualsVariables(theme)){
            setVariablesFromTheme(theme);
        }
        if (item && 'theme' in item  && itemTheme !== item.theme){
            setItemTheme(item.theme);
        }
        else if (item && !('theme' in item) && itemTheme !== null){
            setItemTheme(null);
        }
    }, [fonts, itemID, itemTheme]);

    const [error, setError] = React.useState('');

    const save = () => {
        if (checkEmptyVariables()){
            setError('Cannot save with empty field');
            return;
        } else {
            var themeToSave;
            if (custom){
                themeToSave = {
                    theme: {
                        primaryFontFamily: primaryFontFamily,
                        secondaryFontFamily: secondaryFontFamily,
                        primaryColor: primaryColor,
                        secondaryColor: secondaryColor,
                        headerBackgroundColor: headerBackgroundColor
                    },
                    id: portfolioID
                }
            }
            else {
                themeToSave = {
                    theme: {
                        primaryFontFamily: selectedPresetFonts.primaryFontFamily,
                        secondaryFontFamily: selectedPresetFonts.secondaryFontFamily,
                        primaryColor: selectedPresetColors.primaryColor,
                        secondaryColor: selectedPresetColors.secondaryColor,
                        headerBackgroundColor: selectedPresetColors.headerBackgroundColor
                    },
                    id: portfolioID
                }
            }
            setError('');
            if (itemID === ''){
                saveTheme(themeToSave);
            }
            else {
                saveTheme.id = itemID;
                saveItemTheme(themeToSave);
            }
        }
    }
    return (
        <Box>
            <FormControlLabel
                control={<Checkbox checked={custom} onChange={(e) => {handleCustomChange(e)}} color = 'primary' name='Custom'/>}
                label="Use custom theme"
                labelPlacement = 'start'
                className={classes.drawerPadding}
            />
            {custom ?
            <List>
                <ListItem className={classes.themeItem}>
                    <Typography variant='body1'>Primary Colour</Typography>
                    <SketchPicker
                        color={primaryColor}
                        onChangeComplete={handlePrimaryColorChange}>
                    </SketchPicker>
                </ListItem>
                <ListItem className={classes.themeItem}>
                    <Typography variant='body1'>Secondary Color</Typography>
                    <SketchPicker
                        color={secondaryColor}
                        onChangeComplete={handleSecondaryColorChange}>
                    </SketchPicker>
                </ListItem>
                <ListItem className={classes.themeItem}>
                    <Typography variant='body1'>Header Background Color</Typography>
                    <SketchPicker
                        color={headerBackgroundColor}
                        onChangeComplete={handleHeaderBackgroundColorChange}>
                    </SketchPicker>
                </ListItem>
                <ListItem className={classes.themeItem}>
                    <Typography variant='body1'>Headers Font</Typography>
                    <Select
                        defaultValue='Select a font'
                        value={primaryFontFamily}
                        onChange={handlePrimaryFontFamilyChange}
                        className={classes.select}>
                        {fonts.map((font) => {
                            return (<MenuItem value={font.family}>{font.family}</MenuItem>);
                        })}
                    </Select>
                </ListItem>
                <ListItem className={classes.themeItem}>
                    <Typography variant='body1'>Body Font</Typography>
                    <Select
                        defaultValue='Select a font'
                        value={secondaryFontFamily}
                        onChange={handleSecondaryFontFamilyChange}
                        className={classes.select}>
                        {fonts.map((font) => {
                            return (<MenuItem value={font.family}>{font.family}</MenuItem>);
                        })}
                    </Select>
                </ListItem>
            </List> :
            <List>
                <ListItem>  
                    <Typography variant='body1'>Select a preset color theme</Typography>
                </ListItem>
                <ListItem>
                    <Select
                        defaultValue='Select a preset color theme'
                        value={selectedPresetColors.name ? selectedPresetColors.name : ''}
                        onChange={handlePresetColorChange}
                        className={classes.select}>

                        {Object.keys(PresetThemes.Colors).map((key) => {
                            return (<MenuItem value={PresetThemes.Colors[key].name}>
                                {PresetThemes.Colors[key].name}
                            </MenuItem>)})}
                    </Select>
                </ListItem>
                <ListItem>
                    <Typography variant='body1'>{selectedPresetColors.name}</Typography>
                    <Box style={{backgroundColor: selectedPresetColors.primaryColor}} className={classes.displayColor}></Box>
                    <Box style={{backgroundColor: selectedPresetColors.secondaryColor}} className={classes.displayColor}></Box>
                    <Box style={{backgroundColor: selectedPresetColors.headerBackgroundColor}} className={classes.displayColor}></Box>
                </ListItem>
                <ListItem>
                    <Typography variant='body1'>Select a preset font theme</Typography>
                </ListItem>
                <ListItem>
                    <Select
                        defaultValue='Select a preset font theme'
                        value={selectedPresetFonts.name ? selectedPresetFonts.name : ''}
                        onChange={handlePresetFontChange}
                        className={classes.select}>

                        {Object.keys(PresetThemes.Fonts).map((key) => {
                            return (<MenuItem value={PresetThemes.Fonts[key].name}>
                                {PresetThemes.Fonts[key].name}
                            </MenuItem>)})}
                    </Select>
                </ListItem>
                {fontTheme && <ListItem>
                    <ThemeProvider theme={fontTheme}>
                        <CssBaseline/>
                        <DisplayFonts classes={classes}></DisplayFonts>
                    </ThemeProvider>
                </ListItem>}
            </List>}
            {error.length !== 0 && <Typography variant='body1'>{error}</Typography>}
            <Box className={classes.drawerPadding}>
                <Button
                    variant='outlined' 
                    color='primary'
                    classes={{
                        label: theme.buttonLabel
                    }}
                    onClick={save}>
                    SAVE THEME
                </Button>
            </Box>
        </Box>
    );
}

const DisplayFonts = (classes) => {
    classes = useStyles();
    return (
        <Box>
            <Typography variant='h3'>Headers font</Typography>
            <Typography variant='body1'>Body font</Typography>
        </Box>
    )
}

PortfolioTheme.propTypes = {
    getFonts: PropTypes.func.isRequired,
    fonts: PropTypes.arrayOf(PropTypes.object).isRequired,
    saveTheme: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    saveItemTheme: PropTypes.func.isRequired,
    getFontTheme: PropTypes.func.isRequired,
    fontTheme: PropTypes.object
};
  
const mapStateToProps = (state) => ({
    fonts: state.googleFonts.fonts,
    theme: state.eportfolio.theme,
    fontTheme: state.eportfolio.fontTheme
});
  
export default connect(mapStateToProps, {getFonts, saveTheme, saveItemTheme, getFontTheme})(PortfolioTheme);