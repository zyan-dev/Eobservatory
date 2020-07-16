import Axios from 'axios';
import * as types from '../types';

import { powerBIDefinitions } from '../../lib/constants';
/************/



/**
 * Used to set the Authorization header field with current Token
 *
 * @return {void}
 */
export const setAuthToken = () => (dispatch, getState) => {
  const state = getState()
  const token = state.dashboardReducer.loginObject.token;

  if (token) {

    Axios.defaults.headers.common['Authorization'] = `Token ${token}`;

  } else {
    Axios.defaults.headers.common['Authorization'] = null;
    delete Axios.defaults.headers.common['Authorization'];
  }
}

/**
 * Post to /session to retrieve user Token and grant access to protected api calls
 *
 * @param  {object}   param    user/password keys, both strings
 * @param  {Function} callback fn to execute once the call gets resolved
 *
 * @return {action}            SET_DASHBOARD_LOGIN_STATE dispatched with token as payload
 */
export const loginDashboard = (param, callback) => (dispatch) => {

  delete localStorage.token;

  Axios.post(types.URL_DASHBOARD_LOGIN, param)
  .then(res => {

    if (res.data.token) {
      dispatch({
        type: types.SET_DASHBOARD_LOGIN_STATE,
        payload: {
            isLogged: true,
            token: res.data.token,
            userName: param.username
        }
      });
      setTimeout(() => {
        callback('success');
      })
    } else {
      callback('failed');
    }
  })
  .catch(() => {
    callback('failed');
  });
}

/**
 * Used to logout current user
 *
 * @param {function} callback to be executed once the call gets resolved
 *
 * @return {action} SET_DASHBOARD_LOGIN_STATE dispatched with loginObject as payload
 */
export const logoutDashboard = (callback) => (dispatch) => {

  Axios.get(types.URL_DASHBOARD_LOGOUT)
  .then(res => {

    if (res.data.done) {

      callback(true);

      delete localStorage.token;

      dispatch({
        type: types.RESET_DASHBOARD_REDUCER
      });
    }

  })
  .catch((e) => {
    console.log(e);
  });
}

/**
 * Used to retrieve the PowerBI private tokens from backend
 *
 * @param  {string}  reportId of which we need the token
 * @return {action}   SET_POWERBI_INFO dispatched with the tokens as payload
 */
export const getPowerBIToken = reportId => (dispatch) => {

  Axios.get(`${types.URL_DASHBOARD_POWERBI}?REPORT_ID=${reportId}`)
  .then(res => {

    dispatch({
      type: types.SET_POWERBI_INFO,
      payload: res.data
    });
  })
  .catch(e => {
    console.log(e);
  });
}

/**
 * Used to retrieve the PowerBI private tokens from backend for comparison report
 *
 * @return {action}   SET_POWERBI_INFO_COMPARISON dispatched with the tokens as payload
 */
export const getPowerBITokenForComparison = () => (dispatch) => {

  let reportId = powerBIDefinitions.adminComparison.reportId;

  Axios.get(`${types.URL_DASHBOARD_POWERBI}?REPORT_ID=${reportId}`)
  .then(res => {

    dispatch({
      type: types.SET_POWERBI_INFO_COMPARISON,
      payload: res.data
    });
  })
  .catch(e => {
    console.log(e);
  });
}

/************/



/**
 * Retrieve the companies list
 *
 * @return {action} SET_DASHBOARD_COMPANIES dispatched with the companies array as payload
 */
export const fetchCompanies = () => (dispatch) => {

  dispatch(setAuthToken());

  Axios.get(types.URL_GET_DASHBOARD_COMPANIES)
  .then(res => {

    dispatch({
      type: types.SET_DASHBOARD_COMPANIES,
      payload: res.data
    });
  })
  .catch(e => console.log(e));
}

/**
 * Used to retrieve a single company detailed info
 *
 * @param  {int} hash Unique id for a company
 *
 * @return {action}   SET_SELECTED_COMPANY dispatched with the company detail as payload
 */
export const fetchCompanyDetail = hash => (dispatch) => {

  dispatch(setAuthToken());

  Axios.get(`${types.URL_GET_DASHBOARD_COMPANY_DETAIL}?hashcode=${hash}`)
  .then(res => {

    dispatch({
      type: types.SET_SELECTED_COMPANY,
      payload: res.data
    });
  })
  .catch(() => {

    dispatch({
      type: types.SET_SELECTED_COMPANY,
      payload: {}
    });
  });
};

/**
 * Update selected company changes in State. The reducer will use ... to merge existing
 * company detail object in state with this one -> this key gets updated
 *
 * @param  {obj} field Object containing the 1 key to be updated
 *
 * @return {action} UPDATE_SELECTED_COMPANY dispatched with field obj as payload
 */
export const updateSelectedCompany = field => ({
  type: types.UPDATE_SELECTED_COMPANY,
  payload: field
});

/**
 * Used to save changes on the company contact info
 *
 * @param  {object}   data     company object
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const saveSelectedCompany = (data, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.put(`${types.URL_GET_DASHBOARD_COMPANY_DETAIL}${data.startup_id}/`, data)
  .then(() => {
    callback('success');
  })
  .catch(() => {
    callback('failed');
  });
}

/**
 * Used to delete a company contact
 *
 * @param  {object}   data     company object
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const deleteSelectedCompany = (data, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.delete(`${types.URL_GET_DASHBOARD_COMPANY_DETAIL}${data.startup_id}/`, { data })
      .then(() => {
        callback('success');
      })
      .catch(() => {
        callback('failed');
      });
}

/**
 * Used to upload a CSV file with new companies
 *
 * @param {file} excelFile to upload
 * @param {function} callback to be executed after the call gets resolved
 *
 * @return {action} SET_DASHBOARD_COMPANIES dispatched with the new companies concat with current array
 */
export const uploadCompanyCSV = (excelFile, callback) => (dispatch) => {

  // Will upload the file within a form of type `multipart/form-data`
  let data = new FormData();

  data.append('file', excelFile);

  dispatch(setAuthToken());

  Axios.post(types.URL_POST_DASHBOARD_COMPANIES_FILE, data)
  .then(res => {

    dispatch({
      type: types.ADD_NEW_COMPANIES,
      payload: res.data.data
    });

    setTimeout(() => {
      callback(res.data);
    });

  })
  .catch(e => {
    console.log(e)
  });
}

/************/



/**
 * Retrieve surveys list
 *
 * @return {action} SET_DASHBOARD_SURVEYS dispatched with the surveys array as payload
 */
export const fetchSurveys = () => (dispatch) => {

  dispatch(setAuthToken());

  Axios.get(types.URL_GET_DASHBOARD_SURVEYS)
  .then(res => {

    dispatch({
      type: types.SET_DASHBOARD_SURVEYS,
      payload: res.data
    })
  })
  .catch(e => console.log(e));
}

/**
 * Used to retrieve a single survey detail with its responses
 *
 * @param  {int} id survey_launch_id, unique id for a survey
 *
 * @return {action}   SET_SELECTED_SURVEY_RESPONSES dispatched with the survey detail as payload
 */
export const fetchSurveyDetail = (id) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.get(`${types.URL_GET_DASHBOARD_SURVEY_DETAIL}?survey_launch_id=${id}`)
  .then(res => {

    dispatch({
      type: types.SET_SELECTED_SURVEY_RESPONSES,
      payload: res.data
    })
  })
  .catch(e => console.log(e));
}

/**
 * Used to download the survey responses as an Excel file

 * @param  {int}   survey_launch_id unique id for the current survey
 * @param  {Function} callback         to be executed once the endpoint gets resolved

 * @return {void}
 */
export const downloadSurveyResponses = (survey_launch_id, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.get(`${types.URL_GET_DASHBOARD_SURVEY_RESPONSES_EXCEL}?survey_launch_id=${survey_launch_id}`)
  .then(() => {

    callback(true);
  })
  .catch((e) => {
    callback(false);
    console.log(e);
  });

}

/**
 * Used to PUT a new survey_date_ends to open/close a survey
 *
 * @param  {boolean}  requestToOpen true if the order is to OPEN the survey
 * @param  {object}   param    with the campaign to be locked/unlocked
 * @param  {int}      survey_launch_id of the current campaign
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const changeSurveyLockState = (requestToOpen, param, survey_launch_id, callback) => (dispatch) => {

  dispatch(setAuthToken());

  if (requestToOpen) {
    param.survey_date_ends = null;

  } else {

    let now = new Date();

    // Past date to close the survey
    param.survey_date_ends = new Date(now.getTime() - 15 * 1000);
  }

  Axios.put(`${types.URL_DASHBOARD_SURVEY_LAUNCH}${survey_launch_id}/`, param)
  .then(() => {

    setTimeout(() => {
      callback(true);
    });
  })
  .catch(() => {
    callback(false);
  });
}

/**
 * Used to POST a new campaign with survey_launch api call
 *
 * @param  {object}   param    with new campaign info from form
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const createNewCampaign = (param, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.post(types.URL_DASHBOARD_SURVEY_LAUNCH, param)
  .then(res => {

    dispatch({
      type: types.ADD_NEW_CAMPAIGN,
      payload: res.data
    });

    setTimeout(() => {
      callback(res.data.survey_launch_id);
    });
  })
  .catch(() => {
    callback(false);
  });
}

/**
 * Used to PUT (update )an existing campaign with survey_launch api call
 *
 * @param  {int}      survey_launch_id of the campaign
 * @param  {object}   param    with new campaign info from form
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const updateCampaign = (survey_launch_id, param, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.put(`${types.URL_DASHBOARD_SURVEY_LAUNCH}${survey_launch_id}/`, param)
  .then(() => {

    setTimeout(() => {
      callback(survey_launch_id);
    });
  })
  .catch(() => {
    callback(false);
  });
}

/**
 * Post to survey_invitation endpoint to send a survey reminder
 *
 * @param  {object}   param    with reminder info from form
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const sendReminder = (param, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.post(types.URL_DASHBOARD_SURVEY_INVITATION, param)
  .then(res => {
    callback('success', res);
  })
  .catch(() => {
    callback('failed');
  });
}

/**
 * Post to send_survey_results endpoint to send the survey results
 *
 * @param  {object}   param    with mailing info from form
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const sendResults = (param, callback) => (dispatch) => {

  dispatch(setAuthToken());

  Axios.post(types.URL_DASHBOARD_SURVEY_SEND_RESULTS, param)
  .then(res => {
    callback('success', res);
  })
  .catch(() => {
    callback('failed');
  });
}
/************/
