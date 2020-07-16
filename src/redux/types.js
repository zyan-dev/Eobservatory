
export const API_BASE_URL = '//back-eobs.8wires.io/';

export const URL_BASE = process.env['REACT_APP_EOBS_BACKEND_URL'] || API_BASE_URL;

// API ENDPOINTS
export const URL_SURVEY_START_UP = `${URL_BASE}user_start_up/`;
export const URL_SURVEY_VISIT = `${URL_BASE}survey_visit/`;
export const URL_GET_SURVEY_RESPONSES = `${URL_BASE}responses/`;
export const URL_POST_SURVEY_RESPONSES = `${URL_BASE}responses/batchPost/`;

export const URL_GET_BUSINESS_TYPE = `${URL_BASE}domain_business_type/`;
export const URL_GET_FUND_TYPE = `${URL_BASE}domain_fund_type/`;
export const URL_GET_PATENT_COUNTRY_LIST = `${URL_BASE}domain_patent_country/`;
export const URL_GET_TABLE_PARTNERSHIP = `${URL_BASE}domain_table_partnerships/`;
export const URL_GET_CURRENCY_LIST = `${URL_BASE}domain_currency/`;
export const URL_GET_COUNTRY_LIST = `${URL_BASE}domain_country/`;
export const URL_GET_REGIONS = `${URL_BASE}domain_region/`;
export const URL_GET_STAGES = `${URL_BASE}domain_stage/`;
export const URL_GET_ACTIVITY_SECTOR = `${URL_BASE}activity_sector/`;

export const URL_GET_DASHBOARD_SURVEYS = `${URL_BASE}protected_survey_status/`;
export const URL_GET_DASHBOARD_SURVEY_DETAIL = `${URL_BASE}protected_survey_status_detailed/`;
export const URL_GET_DASHBOARD_SURVEY_RESPONSES_EXCEL = `${URL_BASE}protected_all_survey_responses/`;
export const URL_GET_DASHBOARD_SURVEY_RESPONSES_EXCEL_DIRECT = `${URL_BASE}all_survey_responses/`;
export const URL_DASHBOARD_SURVEY_LAUNCH = `${URL_BASE}protected_survey_launch/`;
export const URL_DASHBOARD_SURVEY_INVITATION = `${URL_BASE}protected_survey_invitation/`;
export const URL_DASHBOARD_SURVEY_SEND_RESULTS = `${URL_BASE}protected_send_survey_results/`;

export const URL_DASHBOARD_POWERBI = `${URL_BASE}powerBI/`;

export const URL_GET_DASHBOARD_COMPANIES = `${URL_BASE}protected_user_start_up/`;
export const URL_GET_DASHBOARD_COMPANY_DETAIL = `${URL_BASE}user_start_up/`;
export const URL_POST_DASHBOARD_COMPANIES_FILE = `${URL_BASE}protected_user_start_up/upload_from_file/`

export const URL_DASHBOARD_LOGIN = `${URL_BASE}api-token-auth/`;
export const URL_DASHBOARD_LOGOUT = `${URL_BASE}session/logout/`

// Get options
export const SET_BUSINESS_TYPES = 'SET_BUSINESS_TYPES';
export const SET_CURRENCY_LIST = 'SET_CURRENCY_LIST';
export const SET_COUNTRY_LIST = 'SET_COUNTRY_LIST';
export const SET_REGIONS = 'SET_REGIONS';
export const SET_STAGES = 'SET_STAGES';
export const SET_SECTORS = 'SET_SECTORS';
export const SET_FUND_TYPES = 'SET_FUND_TYPES';
export const SET_PATENT_COUNTRY_LIST = 'SET_PATENT_COUNTRY_LIST';
export const SET_TABLE_PARTNERSHIP = 'SET_TABLE_PARTNERSHIP';

// Responsive Action
export const SET_DIMENSION = 'SET_DIMENSION';
export const SET_VISIBLE_SIDEBAR = 'SET_VISIBLE_SIDEBAR';

// Survey
export const SET_SURVEY_VISIT = 'SET_SURVEY_VISIT';
export const UPDATE_COMPANY_STATUS = 'UPDATE_COMPANY_STATUS';
export const UPDATE_ECONOMIC_GROWTH = 'UPDATE_ECONOMIC_GROWTH';
export const UPDATE_FINANCING = 'UPDATE_FINANCING';
export const UPDATE_INTELLECTUAL_PROPERTY = 'UPDATE_INTELLECTUAL_PROPERTY';
export const UPDATE_ENERGY_CHALLENGES = 'UPDATE_ENERGY_CHALLENGES';
export const SET_MAIN_RESPONSES = 'SET_MAIN_RESPONSES';
export const SET_INITIAL_RESPONSES = 'SET_INITIAL_RESPONSES';
export const SET_SUBMITTED = 'SET_SUBMITTED';
export const SET_CURRENCY = 'SET_CURRENCY';
export const SET_PARTNER_NAME = 'SET_PARTNER_NAME';
export const SET_SURVEY_YEAR = 'SET_SURVEY_YEAR';
export const RESET_SURVEY = 'RESET_SURVEY';


// Authentication
export const SET_DASHBOARD_LOGIN_STATE = 'SET_DASHBOARD_LOGIN_STATE';
export const RESET_DASHBOARD_REDUCER = 'RESET_DASHBOARD_REDUCER';

// Survey dashboard
export const SET_DASHBOARD_SURVEYS = 'SET_DASHBOARD_SURVEYS';
export const SET_SELECTED_SURVEY_RESPONSES = 'SET_SELECTED_SURVEY_RESPONSES';
export const SET_SELECTED_SURVEY_NAME = 'SET_SELECTED_SURVEY_NAME';
export const ADD_NEW_CAMPAIGN = 'ADD_NEW_CAMPAIGN';

// Companies dashboard
export const SET_DASHBOARD_COMPANIES = 'SET_DASHBOARD_COMPANIES';
export const SET_SELECTED_COMPANY = 'SET_SELECTED_COMPANY';
export const UPDATE_SELECTED_COMPANY = 'UPDATE_SELECTED_COMPANY';
export const ADD_NEW_COMPANIES = 'ADD_NEW_COMPANIES';

export const SET_POWERBI_INFO = 'SET_POWERBI_INFO';
export const SET_POWERBI_INFO_COMPARISON = 'SET_POWERBI_INFO_COMPARISON';
