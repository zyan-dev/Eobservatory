import * as React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

export default class NumberFormatCustom extends React.Component {

  addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      /* eslint-disable-next-line no-useless-concat */
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  removeCommas(nStr) {
    return parseFloat(nStr.replace(/,/g,''));
  }

  onValueChange = (value) => {
    const { min, max } = this.props;
    let val = 0;
    if(this.removeCommas(value.value.toString()) < min) val = min;
    else if(this.removeCommas(value.value.toString()) > max) val = max;
    else val = value.value;
    val = this.removeCommas(val.toString());

    this.props.onChange({
      target: {
        value: isNaN(val) ? '' : val.toString()
      }
    });
  }

  render() {
    const { value, isCount, prefix, placeholder, isDisabled } = this.props;
    let currency = '';
    if(prefix === 'USD') currency = '$';
    else if(prefix === 'EUR') currency = '€';
    else if(prefix === 'PLN') currency = 'zł';
    else if(prefix === 'SEK') currency = 'kr';
    return (
      <NumberFormat
        value={value}
        style={{
          width: '100%',
          fontSize: 15,
        }}
        onValueChange={this.onValueChange}
        thousandSeparator
        decimalScale={isCount ? 0 : 2}
        allowNegative={false}
        prefix={currency.length > 0 ? currency + ' ' : ''}
        placeholder={placeholder}
        disabled={isDisabled}
      />
    );
  }
}

NumberFormatCustom.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  isCount: PropTypes.bool,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool
};

NumberFormatCustom.defaultProps = {
  min: -1,
  max: 999999999999999,
  isCount: true,
  prefix: '',
  placeholder: '',
  isDisabled: false
}
