import * as React from 'react';
import { connect } from 'react-redux';

import { EmbedPowerBI } from '../../../components';


class EmbedReport extends React.Component {

  componentDidMount() {

    if (!this.props.loginObject.isLogged) {
      this.props.redirectToLogin();
    }
  }

  render() {

    const { powerBI, loginObject } = this.props;

    return (
      <div style={{width: '96%', height: '99%', margin: '40px auto 8px'}}>

        <EmbedPowerBI
          loginObject={loginObject}
          embedTokenReport={powerBI.embed_token_report}>
        </EmbedPowerBI>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loginObject: state.dashboardReducer.loginObject,
  powerBI: state.dashboardReducer.powerBI,
});

const mapDispatchToProps = ({

})

export default connect(mapStateToProps, mapDispatchToProps)(EmbedReport);
