import Axios from 'axios';
import * as types from '../types';
import { validateValue } from '../../lib/operators';
import { typesOfCompany, EnergyChallengeAnswerList } from '../../lib/constants';

/************/



// SIMPLE ACTIONS

export const updateCompanyStatus = data => ({
  type: types.UPDATE_COMPANY_STATUS,
  payload: data
})

export const updateEconomicGrowth = data => ({
  type: types.UPDATE_ECONOMIC_GROWTH,
  payload: data
})

export const updateFinancing = data => ({
  type: types.UPDATE_FINANCING,
  payload: data
})

export const updateIntellectualProperty = data => ({
  type: types.UPDATE_INTELLECTUAL_PROPERTY,
  payload: data
})

export const updateEnergyChallenges = data => ({
  type: types.UPDATE_ENERGY_CHALLENGES,
  payload: data
})

export const updateQuestion = data => ({
  type: types.SET_MAIN_RESPONSES,
  payload: data
})

export const setSubmitted = value => ({
  type: types.SET_SUBMITTED,
  payload: value
})

export const changeCurrency = currency => ({
  type: types.SET_CURRENCY,
  payload: currency
})

export const resetSurvey = (initialData = {}) => ({
  type: types.RESET_SURVEY,
  payload: initialData
})

export const setPartnerName = partnerName => ({
  type: types.SET_PARTNER_NAME,
  payload: partnerName
})

export const setSurveyYear = surveyYear => ({
  type: types.SET_SURVEY_YEAR,
  payload: surveyYear
})
/************/



// AUX FUNCTIONS

/**
 * Given a country_id this fn returns the full country object
 * by matching this id with the countryList
 *
 * @param  {array} countryList full list from API with label/value pairs
 * @param  {int} country_id current country
 *
 * @return {object}          matching country object to use in the view
 */
export const getCountryItem = (countryList, country_id) => {

  const filtered = countryList.filter(country => {
    return country.value === country_id;
  });

  if (filtered.length === 0 && country_id === 'EU') {
    filtered.push({
      label: 'Europe',
      value: 'EU'
    });
  }

  return filtered[0] || {};
}

/**
 * Given a region_id this fn returns the full region object
 * by matching this id with the regionList
 *
 * @param  {array} regionList full list from API with label/value pairs
 * @param  {int} region_id current region
 *
 * @return {object}          matching region object to use in the view
 */
const getRegionItem = (regionList, region_id) => {

  return regionList[region_id - 1] || {}
}

/**
 * Given a fundType label this fn returns the full fundType Object
 * by matching this label with the fundTypes list
 *
 * @param  {array} FundTypes full list from API with label/value pairs
 * @param  {string} fundType current fundType label
 *
 * @return {object}          matching fundType object to use in the view
 */
export const getFundTypeData = (FundTypes, fundType) => {

  const filtered = FundTypes.filter(o => {
    return o.label === fundType;
  });

  return filtered[0] || {};
}

/**
 * Used to match the activity_sector_id with its name based on the full
 * activity sectors obj. Each level have its children_sectors so we can
 * easily complete each obj to return it.
 *
 * @param  {array} levels Array with 3 ordered sector_id
 * @param  {object} sectorsOj Full activity_sector parsed object
 *
 * @return {object}  One object per level with name/value pair in it
 */
const getSectorName = (levels, sectorsOj) => {

    let level1 = {
            label: sectorsOj[levels[0]].name,
            value: Number(levels[0])
        },
        level2 = {
            label: '',
            value: Number(levels[1])
        },
        level3 = {
            label: '',
            value: Number(levels[2]) || null
        };

    // Find level 2 among children_sectors from level 1
    if (sectorsOj[levels[0]].children_sectors &&
        sectorsOj[levels[0]].children_sectors[levels[1]]) {

        level2.label = sectorsOj[levels[0]].children_sectors[levels[1]].name;
    }

    // Find level 3 among children_sectors from level 2
    if (levels[2] !== null && sectorsOj[levels[0]].children_sectors[levels[1]].children_sectors &&
        sectorsOj[levels[0]].children_sectors[levels[1]].children_sectors[levels[2]]) {

        level3.label = sectorsOj[levels[0]].children_sectors[levels[1]].children_sectors[levels[2]].name;
    }

    return {
        level1: level1,
        level2: level2,
        level3: level3
    }
}

/**
 * URL needs to have always the protocol to be post with API
 *
 * @param {string} url current website url
 *
 * @return {string} url with http://
 */
const addProtocolToWebsite = url => {

    let newUrl = url;

    if (url.indexOf('http') === -1) {
        // Add protocol
        newUrl = `http://${url}`;
    }

    return newUrl;
}

/**
 * Used to match a currency id with it's full label
 *
 * @param  {string} currencyId to match
 *
 * @return {string}            currency label
 */
const getCurrencyLabel = currencyId => {

  let currencyLabel = 'Euro (€)';

  if (currencyId === 'PLN') {
    currencyLabel = 'Poland Zloty (zł)';

  } else if (currencyId === 'SEK') {
    currencyLabel = 'Sweden Krona (kr)';

  } else if (currencyId === 'USD') {
    currencyLabel = 'US Dollar ($)';

  } else if (currencyId === 'CHF') {
    currencyLabel = 'Swiss Franc (SFr)';
  }

  return currencyLabel;
}
/************/



// COMPLEX ACTIONS

/**
 * If the URL have a hashKey in it we must check if former responses were saved so
 * the user can resume this survey and change responses. This fn retrieves existing
 * reponses and dispatch the SET_INITIAL_RESPONSES action with all fields in an object
 * placed as payload to fulfill the form.
 *
 * @param  {string}   hash_key of the current survey
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {action}   SET_INITIAL_RESPONSES dispatched with the responses object as payload
 */
export const getInitialResponses = (hash_key, callback) => (dispatch, getState) => {

  const state = getState(),
    options = state.optionReducer;

  Axios.get(`${types.URL_SURVEY_START_UP}?hashcode=${hash_key}`)
  .then((res) => {

    const IQ = res.data;

    let callbackResult = 'success';

    dispatch({
      type: types.SET_INITIAL_RESPONSES,
      payload: {
        company: IQ.company_name,
        country: getCountryItem(options.countryList, IQ.country_id),
        region: getRegionItem(options.regionList, IQ.region_id),
        activity: IQ.activity,
        numberOfCoFounder: String(IQ.number_of_co_founders),
        incorporatedYear: IQ.year_incorporated,
        incubation: IQ.incubation_program ? 'Yes' : 'No',
        website: IQ.website,
        name: IQ.user_name,
        surname: IQ.user_last_name,
        position: IQ.position,
        email: IQ.user_email,
        hashCode: IQ.hashcode,
        startupID: IQ.startup_id,
        startupEobserveID: ''
      }
    });

    if (IQ.company_name && IQ.company_name !== '') {
      callbackResult = 'success_not_empty';
    }

    callback(callbackResult);
  })
  .catch(e => {
    console.log(e.toString());

    callback('error');
  })
}

/**
 * Function used to POST the responses of the first page of the survey regarding the company info.
 * There are two cases here, the existing hashCode and the new survey without hashCode.
 *
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {void}
 */
export const postInitialResponses = callback => (dispatch, getState) => {

  const state = getState();

  const IQ = state.surveyReducer.initial;

  let postObject = {
    startup_EObserve_id: IQ.company,
    company_name: IQ.company,
    activity: IQ.activity,
    number_of_co_founders: IQ.numberOfCoFounder,
    year_incorporated: IQ.incorporatedYear,
    country_id: IQ.country.value,
    region_id: IQ.region ? IQ.region.value : null,
    incubation_program: IQ.incubation === 'Yes' ? true : false,
    website: addProtocolToWebsite(IQ.website),
    user_name: IQ.name,
    user_last_name: IQ.surname,
    user_email: IQ.email,
    position: IQ.position
  }

  if (IQ.hashCode === '') {

    postObject.hashcode = '';

    Axios.post(types.URL_SURVEY_START_UP, postObject)
    .then(res => {
      console.log('Posting initial responses for empty hash case');
      callback(res.data.hashcode, false);
    })
    .catch(error => {

      let errorMsg = '';

      if (error.request.response) {

        errorMsg = JSON.parse(error.request.response).message || 'There was an error on the service, please try again later.';
      }

      callback(errorMsg, true);
    });

  } else {

    postObject.startup_id = IQ.startupID;
    postObject.hashcode = IQ.hashCode;

    Axios.put(`${types.URL_SURVEY_START_UP}${IQ.startupID}/`, postObject)
    .then(() => {
      console.log('Posting initial responses existing hash case');
      callback(IQ.hashCode);
    })
    .catch(() => {
      callback('error');
    })
  }
}

/**
 * Used to register a survey visit and also to retrieve the survey_launch_id and other info
 * needed for posting responses in the rest of the survey
 *
 * @param  {int} hash_key of the current survey
 * @param  {function} callback to be executed after the call gets resolved
 * @return {action}   SET_SURVEY_VISIT dispatched with the survey visit object as payload
 */
export const surveyVisit = (hash_key, callback) => dispatch => {

  Axios.post(`${types.URL_SURVEY_VISIT}?hashcode=${hash_key}`, {})
  .then(res => {

    res.data.year = res.data.survey_of_year;
    res.data.survey_id = 1;

    dispatch({
      type: types.SET_SURVEY_VISIT,
      payload: res.data
    });

    callback(res.data.survey_of_year);

  })
  .catch(e => {

    console.log(e.toString());

    callback(e.request.response);
  });
}

/**
 * If the URL have a hashKey in it we must check if former responses were saved so
 * the user can resume this survey and change responses. This fn retrieves existing
 * reponses and dispatch the SET_MAIN_RESPONSES action with all fields in an object
 * placed as payload to fulfill the form.
 *
 * @param  {string}   hash_key of the current survey
 * @param  {Function} callback to be executed after the call gets resolved
 *
 * @return {action}   SET_MAIN_RESPONSES dispatched with the responses object as payload
 */
export const getMainResponses = (hash_key, callback) => (dispatch, getState) => {

  const state = getState();

  const company_status = state.surveyReducer.company_status,
    economic_growth = state.surveyReducer.economic_growth,
    financing = state.surveyReducer.financing,
    intellectual_property = state.surveyReducer.intellectual_property,
    energy_challenges = state.surveyReducer.energy_challenges,
    options = state.optionReducer;

  let others = {};

  Axios.get(`${types.URL_GET_SURVEY_RESPONSES}?id_token=${hash_key}`)
  .then(res => {

    res.data.forEach(QJ => {

      switch(QJ.question_id) {

        case '1':
          company_status.stage = options.stageList[Number(QJ.response) - 1];
          break;

        case '2':
          company_status.employeeCount = Number(QJ.response);
          break;

        case '3':
          try {

            company_status.operateList = JSON.parse(QJ.response).map(row => {

              const rowInfo = row.split(';');

              return ({
                country: getCountryItem(options.countryList, rowInfo[0]),
                from: rowInfo[1],
                to: rowInfo[2]
              });
            });

          } catch(e) {
            console.log(e.toString())
          }
          break;

        case '4':
          company_status.businessType = options.businessTypeList[Number(QJ.response) - 1];
          break;

        case '5':
          try {

            company_status.sectorList = JSON.parse(QJ.response).map(row => {

              return getSectorName(row.split(';'), options.sectorsList);
            });

          } catch(e) {
            console.log(e.toString())
          }
          break;

        case '6':
          company_status.JobCount2018 = Number(QJ.response);
          break;

        case '7':
          company_status.fullTimeJobCount2018 = Number(QJ.response);
          break;

        case '8':
          company_status.JobCount2019 = Number(QJ.response);
          break;

        case '9':
          company_status.fullTimeJobCount2019 = Number(QJ.response);
          break;

        case '10':

          if (QJ.response === 'No') {

            others.partnerShip = QJ.response;

            company_status.partnerShip = QJ.response;

          } else {

            try {

              JSON.parse(QJ.response).forEach(item => {

                const rowInfo = item.split(';');

                company_status.partnerShip = {
                  ...company_status.partnerShip,
                  [rowInfo[0]]: typesOfCompany[rowInfo[1] - 1],
                };
              });

              others.partnerShip = 'Yes';

            } catch(e) {
              console.log(e.toString())
            }
          }
          break;

        case '11':
          others = {
            ...others,
            currency: {
              label: getCurrencyLabel(QJ.currency),
              value: QJ.currency
            }
          }

          economic_growth.salesAmount = QJ.response;
          break;

        case '12':
          economic_growth.salesPercentage = Number(QJ.response);
          break;

        case '13':
          economic_growth.salesForecastCount = QJ.response;
          break;

        case '14':
          try {

            financing.fundsList = JSON.parse(QJ.response).map(row => {

              const rowInfo = row.split(';');

              return ({
                type: getFundTypeData(options.fundTypes, rowInfo[0]),
                amount: rowInfo[1],
                country: getCountryItem(options.countryList, rowInfo[3]),
                year: rowInfo[4] || null
              });
            });

          } catch(e) {
            console.log(e.toString())
          }
          break;

        case '15':
          financing.percentage = Number(QJ.response);
          break;

        case '16':
          financing.havePlan = QJ.response;

          if (QJ.response !== 'No' && QJ.response !== 'Don`t know yet') {
            others = {
              ...others,
              hasPlanToRaiseFunds: 'Yes'
            }
          } else {
            others = {
              ...others,
              hasPlanToRaiseFunds: QJ.response
            }
          }
          break;

        case '17':
          // 1 - Yes
          // 2 - No
          if (Number(QJ.response) === 2 ||
            Number(QJ.response) === 3) {

            intellectual_property.patentList = 'No';

            others = {
              ...others,
              hasPatent: 'No'
            }

          } else {

            others = {
              ...others,
              hasPatent: 'Yes'
            }

            try {

              intellectual_property.patentList = JSON.parse(QJ.response).map(patent => {

                const patentInfo = patent.split(';');

                return ({
                  country: getCountryItem(options.countryList, patentInfo[0]),
                  year: patentInfo[1],
                  count: patentInfo[2]
                });
              });

            } catch (e) {
              console.log(e.toString())
            }
          }

          break;

        case '18':
          // 1 - Yes
          // 2 - No
          // 3 - Don't know yet


          if (Number(QJ.response) === 2) {

            intellectual_property.planList = 'No';

            others = {
              ...others,
              hasPlan: 'No'
            }

          } else if (Number(QJ.response) === 3) {

            intellectual_property.planList = 'Don\'t know yet';

            others = {
              ...others,
              hasPlan: 'Don\'t know yet'
            }

          } else {

            others = {
              ...others,
              hasPlan: 'Yes'
            }

            try {
              intellectual_property.planList = JSON.parse(QJ.response).map(patentsPlanned => {

                const patentInfo = patentsPlanned.split(';');

                return ({
                  territory: getCountryItem(options.countryList, patentInfo[0]),
                  count: patentInfo[1]
                });
              });

            } catch(e) {
              console.log(e.toString())
            }
          }
          break;

        case '19':
          try {
            const data = QJ.response.split(';');

            energy_challenges.decreaseCost = EnergyChallengeAnswerList[data[0] - 1];
            energy_challenges.decreaseCost_description = data[1];

          } catch(e) {
            console.log(e.toString())
          }
          break;

        case '20':
          try{
            const data = QJ.response.split(';');

            energy_challenges.increaseEnergy = EnergyChallengeAnswerList[data[0] - 1];
            energy_challenges.increaseEnergy_description = data[1];

          } catch(e) {
            console.log(e.toString())
          }
          break;

        case '21':
          try{
            const data = QJ.response.split(';');

            energy_challenges.decreaseFootprint = EnergyChallengeAnswerList[data[0] - 1];
            energy_challenges.decreaseFootprint_description = data[1];

          } catch(e) {
            console.log(e.toString())
          }
          break;

        default:
          break;
      }

    });

    dispatch({
      type: types.SET_MAIN_RESPONSES,
      payload: {
        company_status,
        economic_growth,
        financing,
        intellectual_property,
        energy_challenges,
        ...others
      }
    });

    callback('success');
  })
  .catch(e => {
    console.log('Error parsing main responses:', e.toString());
    callback('error');
  })
}

/**
 * Function used to POST the responses of each section of the the survey.
 *
 * @param  {int} currentIndex of the active section
 *
 * @return {void}
 */
export const postMainResponses = currentIndex => (dispatch, getState) => {

  const state = getState();

  const sectionIDArray = ['', 'A', 'B', 'C', 'D', 'E'];

  const hashCode = state.surveyReducer.hashKey,
    currency = state.surveyReducer.currency,
    responseStaticInfo = {
        ...state.surveyReducer.survey_visit,
        section_id: sectionIDArray[currentIndex]
    };

  let responsesArray = [];

  if (currentIndex === 1) {

    const QJ = state.surveyReducer.company_status;

    Object.keys(QJ).forEach(key => {

      let response = QJ[key];

      // Empty 3rd level on this dropdown is not an error,
      // submit this as a null
      if (key === 'sectorList') {

        response.forEach(sectorRow => {
          if (!sectorRow.level3.value) {
            sectorRow.level3 = {
              value: null,
              name: ''
            }
          }
        });
      }

      // Clear empty rows that get to this point because user click on "add more"
      // button but then didn't complete the new form row
      if (key === 'operateList' && response && Array.isArray(response)) {
        response = response.filter(row => {
          return (Object.keys(row.country).length !== 0 && row.from !== '');
        });
      }

      // Same as the block before
      if (key === 'sectorList' && response && Array.isArray(response)) {
        response = response.filter(row => {
          return (Object.keys(row.level1).length !== 0);
        });
      }


      if (validateValue(response)) {

        let respIsArray = [];

        switch(key) {

          case 'stage':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '1',
              response: response.value
            })
            break;

          case 'employeeCount':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '2',
              response: response
            })
            break;

          case 'operateList':
            respIsArray = response.map((o) => {
              return (`${o.country.value};${o.from};${o.to}`);
            });

            responsesArray.push({
              ...responseStaticInfo,
              question_id: '3',
              response: JSON.stringify(respIsArray)
            })
            break;

          case 'businessType':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '4',
              response: response.value
            })
            break;

          case 'sectorList':
            respIsArray = response.map((o) => {
              return (`${o.level1.value};${o.level2.value};${o.level3.value}`);
            });

            responsesArray.push({
              ...responseStaticInfo,
              question_id: '5',
              response: JSON.stringify(respIsArray)
            })
            break;

          case 'JobCount2018':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '6',
              response: response
            })
            break;

          case 'fullTimeJobCount2018':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '7',
              response: response
            })
            break;

          case 'JobCount2019':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '8',
              response: response
            })
            break;

          case 'fullTimeJobCount2019':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '9',
              response: response
            })
            break;

          case 'partnerShip':

            if (response !== 'No') {

              respIsArray = Object.keys(response).map((key) => {

                const columnIndex = key;
                const rowIndex = typesOfCompany.indexOf(response[key]) + 1;

                return (`${columnIndex};${rowIndex}`);
              });

              responsesArray.push({
                ...responseStaticInfo,
                question_id: '10',
                response: JSON.stringify(respIsArray)
              })

            } else {
              responsesArray.push({
                ...responseStaticInfo,
                question_id: '10',
                response: 'No'
              })
            }
            break;

          default:
        }

      } else {
        console.log('Validate of question format failed OR empty question, some are not added to POST call', currentIndex);
      }

    });

  } else if (currentIndex === 2) {

    const QJ = state.surveyReducer.economic_growth;

    Object.keys(QJ).forEach(key => {

      const response = QJ[key];

      if (validateValue(response)) {

        switch(key) {
          case 'salesAmount':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '11',
              response: response,
              currency: state.surveyReducer.currency.value
            })
            break;

          case 'salesPercentage':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '12',
              response: response
            })
            break;

          case 'salesForecastCount':

            if (response === 'No') {
              responsesArray.push({
                ...responseStaticInfo,
                question_id: '13',
                response: response,
              })

            } else {
              responsesArray.push({
                ...responseStaticInfo,
                question_id: '13',
                response: response,
                currency: state.surveyReducer.currency.value
              })
            }

            break;

          default:
        }

      } else {
        console.log('Validate of question format failed OR empty question, some are not added to POST call', currentIndex);
      }

    });

  } else if (currentIndex === 3) {

    const QJ = state.surveyReducer.financing;

    const surveyYear = state.surveyReducer.surveyYear;

    Object.keys(QJ).forEach(key => {

      let response = QJ[key];

      // This field was removed from UI but needed in the API call
      // so we completed here with the current year -1
      // Also for "No external funds were raised" the amount and country fields have to be completed
      if (key === 'fundsList' && response && Array.isArray(response)) {

        response.forEach(r => {
          // Use current year of survey - 1
          r.year = surveyYear -1;

          if (r.type.value === 0) {
            r.amount = 'none';
            r.country = {label: 'none', value: 'none'}
          }
        });
      }

      // Clear empty rows that get to this point because user click on "add more"
      // button but then didn't complete the new form row
      if (key === 'fundsList' && response && Array.isArray(response)) {

        response = response.filter(row => {
          return (row.amount !== '' && row.type !== '' && Object.keys(row.country).length !== 0);
        });
      }

      if (validateValue(response)) {

        let respIsArray = [];

        switch(key) {
          case 'fundsList':

            respIsArray = response.map(o => {
              return (`${o.type.label};${o.amount};${currency.value};${o.country.value};${o.year};${(currency.value === 'EUR' ? o.amount : 'null')};EUR`);
            })

            responsesArray.push({
              ...responseStaticInfo,
              question_id: '14',
              response: JSON.stringify(respIsArray),
            })
            break;

          case 'percentage':
            responsesArray.push({
              ...responseStaticInfo,
              question_id: '15',
              response: response
            })
            break;

          case 'havePlan':

            if (response !== 'No' && response !== 'Don`t know yet') {
              responsesArray.push({
                ...responseStaticInfo,
                question_id: '16',
                response: response,
                currency: currency.value
              })

            } else {
              responsesArray.push({
                ...responseStaticInfo,
                question_id: '16',
                response: response,
              })
            }
            break;

          default:
        }

      } else {
        console.log('Validate of question format failed OR empty question, some are not added to POST call', currentIndex);
      }

    });

  } else if (currentIndex === 4) {

    const QJ = state.surveyReducer.intellectual_property;

    Object.keys(QJ).forEach((key) => {

      let response = QJ[key];

      // Clear empty rows that get to this point because user click on "add more"
      // button but then didn't complete the new form row
      if (response && Array.isArray(response)) {

        response = response.filter(row => {
          return ((row.country && Object.keys(row.country).length !== 0) ||
            (row.year && Object.keys(row.year).length !== 0) ||
            (row.territory && Object.keys(row.territory).length !== 0));
        });
      }

      if (validateValue(response)) {

        let respIsArray = [];

        switch (key) {

          case 'patentList':

            if (Array.isArray(response)) {

              respIsArray = response.map(o => {
                return (`${o.country.value};${o.year};${o.count}`);
              });

              responsesArray.push({
                ...responseStaticInfo,
                question_id: '17',
                response: JSON.stringify(respIsArray),
              })

            } else {

              responsesArray.push({
                ...responseStaticInfo,
                question_id: '17',
                response: response === 2 ? '2' : '3',
              })
            }

            break;

          case 'planList':

            if (Array.isArray(response)) {

              respIsArray = response.map((o) => {
                return (o.territory.value + ';' + o.count);
              });

              responsesArray.push({
                ...responseStaticInfo,
                question_id: '18',
                response: JSON.stringify(respIsArray),
              })

            } else {

              responsesArray.push({
                ...responseStaticInfo,
                question_id: '18',
                response: response === 2 ? '2' : '3',
              })
            }
            break;

          default:
        }

      } else {
        console.log('Validate of question format failed OR empty question, some are not added to POST call', currentIndex);
      }

    });

  } else if (currentIndex === 5) {

    const QJ = state.surveyReducer.energy_challenges,
      responseIDs = {
          Yes: 1,
          No: 2,
          Neutral: 3
      }

    if (QJ.decreaseCost) {
      responsesArray.push({
        ...responseStaticInfo,
        question_id: '19',
        response: `${responseIDs[QJ.decreaseCost]};${QJ.decreaseCost_description}`,
      })
    }

    if (QJ.increaseEnergy) {
      responsesArray.push({
        ...responseStaticInfo,
        question_id: '20',
        response: `${responseIDs[QJ.increaseEnergy]};${QJ.increaseEnergy_description}`,
      })
    }

    if (QJ.decreaseFootprint) {
      responsesArray.push({
        ...responseStaticInfo,
        question_id: '21',
        response: `${responseIDs[QJ.decreaseFootprint]};${QJ.decreaseFootprint_description}`,
      })
    }
  }


  if (responsesArray.length > 0) {

    Axios.post(types.URL_POST_SURVEY_RESPONSES + '?id_token=' + hashCode, responsesArray)
    .then(() => {

    })
    .catch(e => {
      console.log(e.toString());
    })
  }
}

/************/
