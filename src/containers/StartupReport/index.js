import * as React from 'react';
import { connect } from 'react-redux';

import { dashboardActions } from '../../redux/actions';
import { EmbedPowerBI, Logo } from '../../components';
import { getPowerBIDefinitions } from '../../lib/operators';

const page = {
  container: {
    padding: '0 20px'
  },
  wrapper: {
    boxSizing: 'border-box',
    width: '100%',
    height: '98vh',
    padding: '10px 0 8px'
  }
}


class StartupReport extends React.Component {

  componentDidMount() {

    this.partnerName = this.props.match.params.partner_name || 'Innoenergy';

    this.startupHash = this.props.match.params.hash_key;

    let reportId = getPowerBIDefinitions('', false, this.startupHash).reportId;

    this.props.getPowerBIToken(reportId);
  }

  render() {

    const { powerBI } = this.props;

    return (

      <div style={page.container}>

        <Logo className='logoReport' userName={this.partnerName} />

        <div style={page.wrapper}>
          <EmbedPowerBI
            startupHash={this.startupHash}
            embedTokenReport={powerBI.embed_token_report} >
          </EmbedPowerBI>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  powerBI: state.dashboardReducer.powerBI,
});

const mapDispatchToProps = ({
  getPowerBIToken: dashboardActions.getPowerBIToken,
})

export default connect(mapStateToProps, mapDispatchToProps)(StartupReport);
