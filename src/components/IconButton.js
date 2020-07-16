import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

class IconButton extends React.Component {

  render() {
    const { size, backgroundColor, color, fontSize, icon, margin, visible, onPress } = this.props;
    if(!visible) {
      return null;
    }
    return(
      <Fab
        aria-label="Add"
        onClick={onPress}
        style={{
          width: size,
          height: size,
          backgroundColor,
          minHeight: size,
          minWidth: size,
          margin: margin
        }}
      >
        <Icon style={{color, fontSize}}>{icon}</Icon>
      </Fab>
    )
  }
}

IconButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  margin: PropTypes.string,
  visible: PropTypes.bool
};

IconButton.defaultProps = {
  size: 30,
  backgroundColor: 'primary',
  color: 'white',
  fontSize: 20,
  margin: "10px",
  visible: true
}

export default IconButton;
