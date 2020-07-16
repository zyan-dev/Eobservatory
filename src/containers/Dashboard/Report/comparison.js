import * as React from 'react';
import { connect } from 'react-redux';

import { EmbedPowerBI } from '../../../components';


class EmbedReportComparison extends React.Component {

  componentDidMount() {

    if (!this.props.loginObject.isLogged) {
      this.props.redirectToLogin();
    }
  }

  render() {

    const { powerBIComparison, loginObject } = this.props;

    return (
      <div style={{width: '96%', height: '99%', margin: '40px auto 8px'}}>

        <EmbedPowerBI
          isComparison={true}
          loginObject={loginObject}
          embedTokenReport={powerBIComparison.embed_token_report} >
        </EmbedPowerBI>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loginObject: state.dashboardReducer.loginObject,
  powerBIComparison: state.dashboardReducer.powerBIComparison,
});

const mapDispatchToProps = ({

})

export default connect(mapStateToProps, mapDispatchToProps)(EmbedReportComparison);
