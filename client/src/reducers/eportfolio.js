import {
  GET_USER_EPORTFOLIOS,
  GET_SAVED,
  EPORTFOLIOS_ERROR,
  GET_EPORTFOLIO_THUMBNAILS,
  CREATE_PORTFOLIO_NAME,
  RESET_CREATEPORTFOLIO_NAME,
  CREATE_PORTFOLIO,
  GET_PORTFOLIO,
  GET_PORTFOLIO_GUEST,
  GET_PAGE,
  DELETE_PORTFOLIO,
  ADD_ITEM,
  EDIT_ITEM,
  DELETE_ITEM,
  GET_COMMENTS,
  COMMENTS_ERROR,
  POST_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  CREATE_PAGE,
  EDIT_PAGENAME,
  MAKE_MAIN,
  DELETE_PAGE,
  ADD_SOCIAL_MEDIA,
  GET_TEMPLATES,
  SET_PRIVACY,
  SHARE_PORTFOLIO,
  SAVE_PORTFOLIO,
  GET_ERROR,
  SAVE_THEME,
  GET_THEME,
  GET_ITEM_THEME,
  SAVE_ITEM_THEME,
  GET_FONT_THEME
} from '../actions/types';

const initialState = {
  portfolio: {},
  page: {},
  userEPortfolios: [],
  savedPortfolios: [],
  eportfolioThumbnails: [],
  createPortfolioDetails:{name: '', privacy: false, emails: []},
  loading: true,
  comments: {},
  templates: [],
  theme: {},
  muiTheme: {},
  headerTheme: {},
  itemMuiThemes: [],
  fontTheme: {},
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER_EPORTFOLIOS:
      return {
        ...state,
        userEPortfolios: payload,
        loading: false,
        error: {},
      };
    case GET_SAVED:
      return {
        ...state,
        savedPortfolios: payload,
        loading: false,
        error: {},
      };
    case GET_EPORTFOLIO_THUMBNAILS:
      return {
        ...state,
        eportfolioThumbnails: state.eportfolioThumbnails.concat(payload),
        loading: false,
        error: {},
      };
    case CREATE_PORTFOLIO_NAME:
      return {
        ...state,
        loading: false,
        createPortfolioDetails: payload,
        error: {},
      };
    case RESET_CREATEPORTFOLIO_NAME:
      return {
        ...state,
        loading: false,
        createPortfolioDetails: payload,
        error: {},
      };
    case CREATE_PORTFOLIO:
      return {
        ...state,
        loading: false,
        createPortfolioDetails: payload,
        eportfolioThumbnails: [],
        userEPortfolios: [],
        error: {},
      };
    case DELETE_PORTFOLIO:
      return {
        ...state,
        loading: false,
        eportfolioThumbnails: [],
        userEPortfolios: [],
        error: {},
      };
    case GET_PORTFOLIO:
      return {
        ...state,
        portfolio: payload,
        theme: payload.theme,
        loading: false,
        error: {},
      };
    case GET_PORTFOLIO_GUEST:
      return {
        ...state,
        portfolio: payload,
        theme: payload.theme,
        loading: false,
        error: {},
      };
    case GET_PAGE:
      return {
        ...state,
        page: payload,
        loading: false,
        error: {},
      };
    case CREATE_PAGE:
      return {
        ...state,
        portfolio: payload,
        loading: false,
        error: {},
      };
    case EDIT_PAGENAME:
      return {
        ...state,
        portfolio: payload,
        loading: false,
        error: {},
      };
    case MAKE_MAIN:
    return {
      ...state,
      portfolio: payload,
      loading: false,
      error: {},
    };
    case DELETE_PAGE:
    return {
      ...state,
      portfolio: payload,
      loading: false,
      error: {},
    };
    case EDIT_ITEM:
      return {
        ...state,
        page: {
          ...state.page,
          items: state.page.items.map((item) =>
            item._id === payload._id ? payload : item
          ),
        },
        loading: false,
        error: {},
      };
    case ADD_ITEM:
      return {
        ...state,
        page: { ...state.page, items: [...state.page.items, payload] },
        loading: false,
        error: {},
      };
    case DELETE_ITEM:
      return {
        ...state,
        page: {
          ...state.page,
          items: state.page.items.filter((item) => item._id !== payload._id),
        },
        loading: false,
        error: {},
      };
    case ADD_SOCIAL_MEDIA:
      return {
        ...state,
        portfolio: payload,
        loading: false,
        error: {},
      };
    case SAVE_PORTFOLIO:
      return {
        ...state,
        savedPortfolios: payload,
        loading: false,
        error: {},
      };
    case EPORTFOLIOS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case GET_TEMPLATES:
        return {
          ...state,
          templates: payload,
          loading: false,
          error: {},
        };
    case GET_COMMENTS:
      return {
        ...state,
        comments: { ...state.comments, ...payload },
        loading: false,
        error: {},
      };
    case COMMENTS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case POST_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [payload.item]: [payload, ...state.comments[payload.item]],
        },
        loading: false,
        error: {},
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: { ...payload },
        loading: false,
        error: {},
      };
    case EDIT_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [payload.item]: state.comments[payload.item].map((comment) =>
            comment._id == payload._id ? payload : comment
          ),
        },
        loading: false,
        error: {},
      };
    case SET_PRIVACY:
      return {
        ...state,
        portfolio: payload,
        loading: false,
        error: {},
      };
    case SHARE_PORTFOLIO:
        return {
          ...state,
          portfolio: payload,
          loading: false,
          error: {},
        };
    case SAVE_THEME: 
        return {
          ...state,
          theme: payload.theme,
          portfolio: { ...state.portfolio, theme: payload.theme },
          loading: false,
          error: {}
        }
    case GET_THEME:
        return {
          ...state,
          muiTheme: payload.mainTheme,
          headerTheme: payload.headerTheme,
          loading: false,
          error: {}
        }
    case GET_ITEM_THEME:
        return {
          ...state,
          itemMuiThemes: state.itemMuiThemes.findIndex(i=>i.id===payload.id) === -1 ? [...state.itemMuiThemes, payload] : state.itemMuiThemes,
          loading: false,
          error: {}
        }
    case SAVE_ITEM_THEME: 
        return {
          ...state,
          page: {
            ...state.page,
            items: state.page.items.map((item) =>
              item._id === payload.id ? item.theme = payload.theme : item
            ),
          },
          loading: false,
          error: {}
        }
    case GET_FONT_THEME:
      return {
        ...state,
        fontTheme: payload
      }
    case GET_ERROR:
      return state;
    default:
      return state;
  }
}
