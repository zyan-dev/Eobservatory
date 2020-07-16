import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ResponseView extends React.Component {
  render() {
    const { toggleWidth, screenWidth, type, children } = this.props;
    if((type === 'mobile' && screenWidth > toggleWidth) || (type === 'browser' && screenWidth < toggleWidth)) return null;
    else if((type === 'mobile' && screenWidth < toggleWidth) || (type === 'browser' && screenWidth > toggleWidth)){
      return children;
    } else {
      return true;
    }
  }
}

ResponseView.propTypes = {
  toggleWidth: PropTypes.number,
  type: PropTypes.string
};

ResponseView.defaultProps = {
  toggleWidth: 640,
  type: "mobile"
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
});

export default connect(mapStateToProps, {})(ResponseView);
