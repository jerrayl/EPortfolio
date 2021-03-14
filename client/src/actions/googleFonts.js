import axios from 'axios';
import { FONTS_ERROR, GET_FONTS, RETRIEVE_FONTS } from './types';

const api = axios.create({
    baseURL: 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAfflz9-dim4faQkIH0WCgRnv5WKmkf970',
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getFonts = () => async (dispatch) => {
    try {
        const res = await api.get('');
        dispatch({
          type: GET_FONTS,
          payload: res.data.items,
        });
      } catch (err) {
        dispatch({
          type: FONTS_ERROR,
          payload: { msg: err.message },
        });
      }
}

export const retrieveFonts = () => (dispatch) => {
    dispatch({
        type: RETRIEVE_FONTS,
    });
}