import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Colors } from '../lib/theme';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 0 15px'
  },
  barWrapper: {
    borderRadius: 8,
    background: 'lightgray',
    overflow: 'hidden',
    position: 'relative'
  },
  progressText: {
    color: Colors.gray,
    fontSize: 14,
    padding: 10
  },
  progressFilled: {
    height: 8,
    borderRadius: 8,
    position: 'absolute',
    left: 0,
    top: 0
  }
}

class ProgressBar extends React.Component {

  render() {
    const { classes, label, percent, width, barColor, height, fullWidth, align } = this.props;
    return (
      <div className={classes.container} style={{alignItems: align}}>
        {label.length > 0 && <center className={classes.progressText} >{label}</center>}
        <div className={classes.barWrapper} style={{width: fullWidth ? '100%' : width, height}}>
          <div className={classes.progressFilled} style={{width: Math.floor(percent) + '%', height, backgroundColor: barColor}} />
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  label: PropTypes.string,
  width: PropTypes.number,
  showValue: PropTypes.bool,
  height: PropTypes.number,
  fullWidth: PropTypes.bool,
  barColor: PropTypes.string,
  align: PropTypes.string
};

ProgressBar.defaultProps = {
  label: '',
  width: 100,
  showValue: true,
  height: 8,
  fullWidth: false,
  barColor: Colors.green,
  align: 'center'
}

export default withStyles(styles)(ProgressBar);
