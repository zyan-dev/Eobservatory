import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import {Icon, TextField} from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import { ErrorText, GraySText } from '../styles/global';
import { Colors } from '../lib/theme';

const styles = theme => ({
  formControl: {
    width: '100%',
  },
  select: {
    width: 'calc(100% - 24px)'
  },
  rootInput: {
    padding: 0
  },
  bootstrapInput: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 36px 10px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      backgroundColor: 'white'
    },
    width: 'calc(100% - 48px)'
  },
  numberInput: {
    padding: 10
  },
  rightIcon: {
    top: 'calc(50% - 10px)',
    right: 10,
    color: Colors.gray,
    position: 'absolute',
    fontSize: 20
  },
  textField: {
    margin: 0,
    padding: 0,
    backgroundColor: Colors.lightgray
  },
})

class CustomInput extends React.Component {

  icon = () => {
    return(
      <Icon className={this.props.classes.rightIcon}>keyboard_arrow_down</Icon>
    )
  }

  onChange = (event) => {
    if(this.props.isCount) {
      this.props.onChange({
        target: {
          value: Math.floor(event.target.value)
        }
      })
    } else {
      this.props.onChange(event);
    }
  }

  render() {

    const { classes, label, value, options, type, color, disableFirst, disableOption, rows, multiline, error, placeholder, flex, minNumber, maxNumber } = this.props;

    const selectOptions = disableFirst ? [disableOption].concat(options) : options;

    return(
      <FormControl className={`${classes.formControl} inputContainer`} style={{flex}}>
        {label.length > 0 && <GraySText className="label">{label}</GraySText>}
        {
          type==="select" ?
          <NativeSelect
            classes={{ select: classes.select }}
            IconComponent={this.icon}
            input={
              <InputBase
                id="type"
                onChange={this.props.onChange}
                value={value}
                classes={{ input: classes.bootstrapInput }}
                style={{color}}
                onBlur={this.props.onBlur}
              />
            }
          >
            {
              selectOptions.map((option, index) => (
                <option
                  key={index}
                  disabled={option === disableOption ? true : false}
                  value={option}
                >
                  {option}
                </option>
              ))
            }
          </NativeSelect>
          :type==="number"?
          <TextField
            type="number"
            InputProps={{ inputProps: { min: minNumber, max: maxNumber }, notchedoutline: {backgroundColor: 'red'} }}
            variant="outlined"
            style={{height: 41, backgroundColor: 'white', display: 'flex', justifyContent: 'center'}}
            onInput={(e) => {
              e.target.value = Math.min(e.target.value, maxNumber);
            }}
            onChange={this.onChange}
            value={value}
            onBlur={this.props.onBlur}
            placeholder={placeholder}
          />
          :<InputBase
            id="input"
            onChange={this.props.onChange}
            value={value}
            type={type}
            classes={{ input: classes.bootstrapInput, root: classes.rootInput }}
            multiline={multiline}
            rows={rows}
            rowsMax={5}
            placeholder={placeholder}
            onBlur={this.props.onBlur}
          />
        }
        {error.length > 0 && <ErrorText>{error}</ErrorText>}
      </FormControl>
    )
  }
}

CustomInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  label: PropTypes.string,
  type: PropTypes.string, // input, select or password
  color: PropTypes.string,
  disableFirst: PropTypes.bool,
  disableOption: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  flex: PropTypes.number,
  error: PropTypes.string,
  minNumber: PropTypes.number,
  maxNumber: PropTypes.number,
  isCount: PropTypes.bool,
  onBlur: PropTypes.func,
}

CustomInput.defaultProps = {
  value: '',
  options: [],
  type: 'input',
  color: Colors.text,
  disableFirst: true,
  disableOption: 'Select',
  multiline: false,
  rows: 1,
  placeholder: '',
  label: '',
  flex: 1,
  error: '',
  maxNumber: 999999999,
  isCount: true,
  onBlur: () => undefined
}

export default withStyles(styles)(CustomInput);
