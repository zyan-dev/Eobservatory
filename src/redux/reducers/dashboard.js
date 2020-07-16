import * as types from '../types';

const INITIAL_STATE = {
  loginObject: {
      isLogged: false,
      token: '',
      userName: ''
  },
  powerBI: {},
  powerBIComparison: {},
  companies: [],
  selected_company: {},
  surveys: [],
  survey_detail: [],
  survey_name: '',
};

const dashboardReducer = (state = INITIAL_STATE, action) => {

  switch(action.type) {
    case types.SET_DASHBOARD_LOGIN_STATE:
      return {
          ...state,
          loginObject: action.payload
      }

    case types.SET_POWERBI_INFO:
      return {
          ...state,
          powerBI: action.payload
      }

    case types.SET_POWERBI_INFO_COMPARISON:
      return {
          ...state,
          powerBIComparison: action.payload
      }

    case types.SET_DASHBOARD_COMPANIES:
      return {
        ...state,
        companies: action.payload
      }

    case types.ADD_NEW_COMPANIES:
      return {
        ...state,
        companies: [...state.companies, action.payload]
      }

    case types.SET_SELECTED_COMPANY:
      return {
        ...state,
        selected_company: action.payload
      }

    case types.UPDATE_SELECTED_COMPANY:
      return {
        ...state,
        selected_company: {
          ...state.selected_company,
          ...action.payload
        }
      }

    case types.SET_DASHBOARD_SURVEYS:
      return {
        ...state,
        surveys: action.payload
      }

    case types.ADD_NEW_CAMPAIGN:
      return {
        ...state,
        surveys: [...state.surveys, action.payload]
      }

    case types.SET_SELECTED_SURVEY_RESPONSES:
      return {
        ...state,
        survey_detail: action.payload
      }

    case types.SET_SELECTED_SURVEY_NAME:
      return {
        ...state,
        survey_name: action.payload
      }
    case types.RESET_DASHBOARD_REDUCER:
      return INITIAL_STATE;

    default:
      return state;
  }
}

export default dashboardReducer;
