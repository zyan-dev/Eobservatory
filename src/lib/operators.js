import { powerBIDefinitions } from './constants';

export const validateEmail = (email) => {
  /* eslint-disable-next-line no-useless-escape */
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
}

export const validateURL = (url) => {
  /* eslint-disable-next-line no-useless-escape */
  var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  return re.test(url);
}

export const getYearList = (minYear = 1960, maxYear) => {
  const CY = new Date().getFullYear();

  let yearList = [];

  for (let i = CY; i > minYear; i--) {
    yearList = yearList.concat([i.toString()]);
  }

  if (maxYear) {
    yearList = yearList.filter( y => {
      return y < maxYear
    })
  }

  return yearList;
}

export const generateOptions = (list) => {
  let result = [];

  result = list.map((value) => {
    return ({
        label: value,
        value
    });
  });

  return result;
}

export const generateOptionValue = (str) => {
  if(str === '') return '';
  return {
    label: str,
    value: str
  }
}

/**
 * Used to generate the simple obj needed for react-select from
 * a JSON list
 *
 * @param  {obj} hierarchyObj List of activity sector objects
 * @param  {array} sectors Array with selected sectors for each level
 * @param  {int} levelNum Current level
 *
 * @return {array}           Array for select with label/value
 */
export const generateSectorOptions = (hierarchyObj, sectors, levelNum) => {
    let result,
        options = [];

    if (typeof levelNum === 'undefined' ||
        typeof sectors === 'undefined' ||
        typeof hierarchyObj === 'undefined') {

        return [];
    }

    switch (levelNum) {
        case 1:
            // Return the first level options
            options = Object.values(hierarchyObj);
            break;

        case 2:
            // Level 1 is set so we return the children_sectors
            if (sectors.level1.value) {
                options = Object.values(hierarchyObj[sectors.level1.value].children_sectors);
            }
            break;

        case 3:
            // Both levels 1 and 2 are set so we retrieve its children_sectors
            if (sectors.level1.value && sectors.level2.value) {
                options = Object.values(hierarchyObj[sectors.level1.value].children_sectors[sectors.level2.value].children_sectors)
            }
            break;

        default:
    }

    result = options.map(option => {
        return ({
            label: option.name,
            value: option.activity_sector_id
        });
    });

    return result;
}

/**
 * Special case for sectors dropdowns, no label triggers the placeholder
 *
 * @param  {object} levelObj Current level object with info label/value
 * @return {object}          The seleceted object or a placeholder obj
 */
export const generateSectorOptionValue = levelObj => {

    if (!levelObj.label) {
        // Show placeholder
        return {
            label: 'Select',
            id: null
        }
    }

    return levelObj;
}

export const validateQuestion = (response, category, key, forborder = true) => {

  if (!response.submitted && forborder) {

    return true;
  }

  const value = response[category][key];

  return validateValue(value);
}

export const validateValue = value => {

  const valueType = typeof value;

  if (valueType === 'number') {
    return true;
  }

  if (valueType === 'string' && value.length > 0) {
    return true;
  }

  if (valueType === 'object' && validateObject(value)) {
    return true;
  }

  return false;
}

export const validateObject = (obj) => {

  let count1 = 0;

  if (obj.length === 0) {

    return false;
  }

  if (obj.length === undefined) {

    return Object.keys(obj).length !== 0;

  } else {

    obj.forEach((data) => {

      const dataType = typeof data;

      if (dataType === 'string' && data.length === 0) return true;
      if (dataType === 'number' && data === 0) return true;

      let count2 = 0;

      Object.keys(data).forEach((key) => {

        const value = data[key];
        const valueType = typeof value;

        if(valueType === 'string' && value.length === 0) return true;
        if(valueType === 'number' && value === 0) return true;
        if(valueType === 'object' && !validateObject(value)) return true;

        count2++;
      });

      if (count2 === Object.keys(data).length) {
        count1++;
      }
    });

    return count1 === obj.length;
  }
}

export const addCommas = nStr => {

  nStr += '';

  let x = nStr.split('.'),
    x1 = x[0],
    x2 = x.length > 1 ? '.' + x[1] : '',
    rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    /* eslint-disable-next-line no-useless-concat */
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

export const removeCommas = nStr => {

  return parseFloat(nStr.replace(/,/g,''));
}

/**
 * Check if userName is from admin or not.
 *
 * @param  {string} userName for the current user
 * @param  {boolean} isComparison true if is Innoenergy comparison report
 * @param  {string} startupHash if a startup is accesing the report via url
 *
 * @return {object} with its reportId and embedUrl
 */
export const getPowerBIDefinitions = (userName = '', isComparison = false, startupHash = '') => {

  let isAdmin = userName === 'Innoenergy';


  if (startupHash || !userName) {
    return {...powerBIDefinitions.startup};
  }

  if (isAdmin && !isComparison) {
    return {...powerBIDefinitions.admin};
  }

  if (isComparison) {
    return {...powerBIDefinitions.adminComparison};
  }

  return {...powerBIDefinitions.partner};
}

/**
 * Used to validate the fields in send reminder and new campaign
 * error object example:
 * {
 *  'subject': 'This field is required',
 *  'email_control': 'Enter a valid email'
 * }
 *
 * @param  {string} key        name of the field
 * @param  {string} inputValue its value
 * @param  {object} error      current error object
 *
 * @return {object}            new error object
 */
export const checkMailingCampaignsFields = (key, inputValue, error) => {

  const maxLength = 75;

  if (inputValue.length === 0) {
    error[key] = 'This field is required';

  } else {

    delete error[key];
  }

  if (key === 'subject' &&
    inputValue.length > 0) {

    // check also max length 75
    if (inputValue.length > maxLength) {
      error[key] = `This is too long, please use less than ${maxLength} chars`;

    } else {

      delete error[key];
    }
  }

  if (key === 'email_control' &&
    inputValue.length > 0) {

    if (validateEmail(inputValue)) {
      delete error.email_control;

    } else {
      error.email_control = 'Enter a valid email';
    }
  }

  return error;
}

export const removeDuplicates = (myArr, prop) => {

    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}
