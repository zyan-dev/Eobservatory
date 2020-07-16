import Axios from 'axios';
import * as types from '../types';

/************/



/**
 * Used to fetch the business types options
 *
 * @return {action} SET_BUSINESS_TYPES dispatched with the options as payload
 */
export const getBusinessTypes = () => (dispatch) => {

  Axios.get(types.URL_GET_BUSINESS_TYPE)
  .then(res => {

    let businessTypes = res.data.map(business => {

      return ({
        label: business.name,
        value: business.id
      });
    });

    dispatch({
      type: types.SET_BUSINESS_TYPES,
      payload: businessTypes
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * This action is used to fetch the possible activity sectors to fulfill
 * the 3 levels dropdowns in Q5
 *
 * @return {action} SET_SECTORS dispatched with a JSON containing the sectors hierarchy as payload
 */
export const getSectorActivity = () => (dispatch) => {

  Axios.get(types.URL_GET_ACTIVITY_SECTOR)
  .then(res => {

    dispatch({
      type: types.SET_SECTORS,
      payload: parseSectorActivity(res.data)
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available currency list
 *
 * @return {action} SET_CURRENCY_LIST dispatched with the options as payload
 */
export const getCurrencyList = () => (dispatch) => {

  Axios.get(types.URL_GET_CURRENCY_LIST)
  .then(res => {

    let currencyList = res.data.map(currency => {

      return ({
        label: getCurrencyLabel(currency.currency_code),
        value: currency.currency_code
      });

    });

    dispatch({
      type: types.SET_CURRENCY_LIST,
      payload: currencyList
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available countries to populate the list
 *
 * @return {action} SET_COUNTRY_LIST dispatched with the options as payload
 */
export const getCountryList = () => (dispatch) => {

  Axios.get(types.URL_GET_COUNTRY_LIST)
  .then(res => {

    let countryList = res.data.map(country => {

      return ({
        label: country.name,
        value: country.country_id
      });

    });

    dispatch({
      type: types.SET_COUNTRY_LIST,
      payload: countryList
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available regions within a country
 *
 * @return {action} SET_REGIONS dispatched with the options as payload
 */
export const getRegions = () => (dispatch) => {

  Axios.get(types.URL_GET_REGIONS)
  .then(res => {

    let regionList = res.data.map(region => {

      return ({
        label: region.region_name,
        value: region.id,
        item: region.country_id
      });

    });

    dispatch({
      type: types.SET_REGIONS,
      payload: regionList
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available company stages
 *
 * @return {action} SET_STAGES dispatched with the options as payload
 */
export const getStages = () => (dispatch) => {

  Axios.get(types.URL_GET_STAGES)
  .then(res => {

    let stageList = res.data.map(stage => {

      return {
        label: stage.name,
        value: stage.id
      };

    });

    dispatch({
      type: types.SET_STAGES,
      payload: stageList
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available types of funds raised
 *
 * @return {action} SET_FUND_TYPES dispatched with the options as payload
 */
export const getFundTypes = () => (dispatch) => {

  Axios.get(types.URL_GET_FUND_TYPE)
  .then(res => {

    dispatch({
      type: types.SET_FUND_TYPES,
      payload: parseFundTypes(res.data)
    });
  })
  .catch((e) => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the available countries for patents to be registered
 *
 * @return {action} SET_PATENT_COUNTRY_LIST dispatched with the options as payload
 */
export const getPatentCountryList = () => (dispatch) => {

  Axios.get(types.URL_GET_PATENT_COUNTRY_LIST)
  .then(res => {

    let data = res.data.map(country => {

      return {
        label: country.name,
        value: country.country_id
      };

    });

    dispatch({
      type: types.SET_PATENT_COUNTRY_LIST,
      payload: data
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/**
 * Used to fetch the options to fulfill the partnership table
 *
 * @return {action} SET_TABLE_PARTNERSHIP dispatched with the options as payload
 */
export const getPartnerShipTable = () => (dispatch) => {

  Axios.get(types.URL_GET_TABLE_PARTNERSHIP)
  .then(res => {

    let data = res.data.filter(data => data.is_row).map(item => {

      return {
        label: item.text,
        value: item.row_col_id
      };
    });

    dispatch({
      type: types.SET_TABLE_PARTNERSHIP,
      payload: data
    });

  })
  .catch(e => {
    console.log(e.toString());
  })
}

/************/



// PARSING FUNCTIONS USED WHEN FETCHING OPTIONS

/**
 * Used to create the JSON object with 3 levels hierarchy based on
 * parent_activity_sector value. An example is included in the fn as a comment
 *
 * @param  {array} apiData raw elements from api response
 *
 * @return {object}        parsed object
 */
const parseSectorActivity = apiData => {

    let sectors = {};

    // Parse the 1rst level
    apiData.forEach( item => {

        // No parent id => level 1 items
        if (item.parent_activity_sector === null) {

            item.children_sectors = {};

            sectors[item.activity_sector_id] = item;
        }
    });

    /*
    {
      1: {
          activity_sector_id: 1,
          children_sectors: {
               THIS IS LEVEL 2 CHILDREN LIST
               12: {
                  activity_sector_id: 12,
                  name: "Gas and Steam Turbines",
                  language: "EN",
                  employment_multiplier: 2.677763049,
                  parent_activity_sector: 1,
                  children_sectors: {
                      THIS IS LEVEL 3 CHILDREN LIST
                      16: {
                          activity_sector_id: 16,
                          employment_multiplier: 2.677763049,
                          language: "EN",
                          name: "Project Development",
                          parent_activity_sector: 12,
                      }
                  }
              },
              ...
          },
          employment_multiplier: 2.677763049,
          language: "EN",
          name: "Conventional and Clean Coal Technologies",
          parent_activity_sector: null,
      },
      ...
    }
    */

    // Parsing the 2nd level
    apiData.forEach( item => {

        let sectorLevel1 = sectors[item.parent_activity_sector];

        // If current parent_activity_sector exists as key in Sectors obj
        // then then current item is a 2nd level children
        if (sectorLevel1) {

            item.children_sectors = {};

            sectorLevel1.children_sectors[item.activity_sector_id] = item;
        }
    });

    // Parsing the 3rd level
    apiData.forEach( item => {
        Object.keys(sectors).forEach( key => {

            // If current parent_activity_sector exists as key in any second level item
            // sector[lev1].children_sectors
            // then the current item is a 3rd level children
            let sectorLevel2 = sectors[key].children_sectors[item.parent_activity_sector];

            if (sectorLevel2) {

                item.children_sectors = {};

                sectorLevel2.children_sectors[item.activity_sector_id] = item;
            }
        });
    });

    return sectors;
}

/**
 * Used to create the list of options in Type of Funds raised (Q14) this list has two sublists
 * in it, public and private types. is_Public key will assign each type to one of the lists.
 *
 * @param  {array} list raw elements from api response
 *
 *  @return {array}     list with desired format: (Public) (public options) (Private) (private options)
 */
const parseFundTypes = list => {

  let fundTypes = [{
      label: 'Public',
      value: 'public',
      isDisabled: true
    }],
    noFundType = [],
    publicFundTypes = [],
    privateFundTypes = [];

  list.forEach(fund => {

    if (fund.is_Public && fund.fund_id === 0) {

      noFundType.push({
        label: fund.name,
        value: fund.fund_id
      });

    } else if (fund.is_Public) {

      publicFundTypes.push({
        label: fund.name,
        value: fund.fund_id
      });

    } else if (fund.name !== 'sector') {

      privateFundTypes.push({
        label: fund.name,
        value: fund.fund_id
      });
    }
  });

  fundTypes = [...noFundType, ...fundTypes, ...publicFundTypes];

  fundTypes.push({
    label: 'Private',
    value: 'private',
    isDisabled: true
  });

  fundTypes = [...fundTypes, ...privateFundTypes];

  return fundTypes;
}

/************/



// AUX FUNCTIONS

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
