import * as React from 'react';
import PropTypes from 'prop-types';

class IfView extends React.Component {

  render() {
    const { condition, children } = this.props;
    if(condition){
      return children[0];
    } else {
      return children[1];
    }
  }
}

IfView.propTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.node)
};

export default IfView;
