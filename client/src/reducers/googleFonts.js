import { FONTS_ERROR, GET_FONTS } from '../actions/types';

const initialState = {
    fonts: [],
    loading: true,
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) { 
        case GET_FONTS:
            return {
                ...state,
                fonts: payload,
                loading: false,
                error: {},
            };
        case FONTS_ERROR:
            return state;
        default: 
            return state;
    }
}