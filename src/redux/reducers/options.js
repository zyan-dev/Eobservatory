import * as types from '../types';

const INITIAL_STATE = {
  businessTypeList: [],
  countryList: [],
  currencyList: [],
  regionList: [],
  stageList: [],
  sectorsList: {},
  fundTypes: [],
  patentCountryList: [],
  partnerShipList: []
};

const optionReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.SET_BUSINESS_TYPES:
      return {
        ...state,
        businessTypeList: action.payload
      }
    case types.SET_SECTORS:
      return {
        ...state,
        sectorsList: action.payload
      }
    case types.SET_CURRENCY_LIST:
      return {
        ...state,
        currencyList: action.payload
      }
    case types.SET_COUNTRY_LIST:
      return {
        ...state,
        countryList: action.payload
      }
    case types.SET_REGIONS:
      return {
        ...state,
        regionList: action.payload
      }
    case types.SET_STAGES:
      return {
        ...state,
        stageList: action.payload
      }
    case types.SET_FUND_TYPES:
      return {
        ...state,
        fundTypes: action.payload
      }
    case types.SET_PATENT_COUNTRY_LIST:
      return {
        ...state,
        patentCountryList: action.payload
      }
    case types.SET_TABLE_PARTNERSHIP:
      return {
        ...state,
        partnerShipList: action.payload
      }
    default:
      return state;
  }
}

export default optionReducer;
