import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Icon} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Colors } from '../lib/theme';

const styles = {
  wrapper: {
    position: 'relative',
    background: 'white',
    borderRadius: 4,
  },
  datePicker: {
    width: '100%',
    border: '1px solid #ced4da',
    borderRadius: 4,
    height: 40,
    overflow: 'hidden',
    margin: 0   
  },
  datePickerInput: {
    minHeight: 60,
    marginTop: -10,
    paddingLeft: 12,
    color: Colors.text
  },
  datePickerIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
    bottom: 5,
    fontSize: 30,
    color: Colors.green
  },
};

class CustomDatePicker extends React.Component {

  render() {
    const { classes, date, borderColor, disablePast } = this.props;
    return(
      <div className={classes.wrapper}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            margin="normal"
            placeholder="Select start date"
            value={date === '' ? new Date() : date}
            disablePast={disablePast}
            className={classes.datePicker}
            onChange={this.props.onSelect}
            InputProps={{className: classes.datePickerInput}}
            format={'yyyy-MM-dd'}
            style={{borderColor}}
          />
        </MuiPickersUtilsProvider>
        <Icon className={classes.datePickerIcon}>date_range</Icon>
      </div>
    )
  }
}

CustomDatePicker.propTypes = {
  date: PropTypes.any.isRequired,
  onSelect: PropTypes.func.isRequired,
  borderColor: PropTypes.string,
  dateColor: PropTypes.string,
  disablePast: PropTypes.bool
}

CustomDatePicker.defaultProps = {
  borderColor: '#ced4da',
  dateColor: Colors.text,
  disablePast: false
}

export default withStyles(styles)(CustomDatePicker);