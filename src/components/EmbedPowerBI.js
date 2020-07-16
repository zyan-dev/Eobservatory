import React from 'react';
import PropTypes from 'prop-types';

import Report from '@mimov/powerbi-report-component';

import { getPowerBIDefinitions } from '../lib/operators';

class EmbedPowerBI extends React.Component {

  constructor(props) {

    super(props);

    const { loginObject, isComparison, startupHash } = this.props;

    this.report = null;

    this.powerBIData = getPowerBIDefinitions(loginObject.userName, isComparison, startupHash)
  }

  getFilter = () => {

    const { loginObject, startupHash } = this.props;

    let filterValue;

    // Check if filter is needed
    if (this.powerBIData.filter !== false) {

      filterValue = startupHash ? startupHash : loginObject.token;

      this.powerBIData.filter.values = [];
      this.powerBIData.filter.values.push(filterValue);

      return this.powerBIData.filter;
    }

    // This will be cleaned from the config object in the powerbi-report-component
    // so not filter will be applied
    return undefined;
  }

  handleReportLoad = report => {

    if (this.report !== null) {

      return;
    }

    // It will be called when report loads
    // Get the object from callback and store it
    this.report = report;
  }


  render() {

    const { embedTokenReport } = this.props,
      filterToApply = this.getFilter(),
      extraSettings = {
        filterPaneEnabled: false,
        navContentPaneEnabled: true
      };

    return (
      <div style={{width: '100%', height: '100%'}}>
        { embedTokenReport &&
          <Report
            embedType = 'report'
            tokenType = 'Embed'
            extraSettings = {extraSettings}
            accessToken = {embedTokenReport}
            embedUrl = {this.powerBIData.embedUrl}
            embedId = {this.powerBIData.reportId}
            onLoad = {this.handleReportLoad}
            initialFilter = {filterToApply}
            permissions = 'All'
            style = {{width: '100%', height: '99%'}}
          />
        }
        {
          !embedTokenReport &&
          <p style={{marginLeft: '20px'}}>Failed to retrieve a valid token</p>
        }
      </div>
    )

  }
}

EmbedPowerBI.propTypes = {
  startupHash: PropTypes.string,
  isComparison: PropTypes.bool,
  loginObject: PropTypes.object,
  embedTokenReport: PropTypes.string
}

EmbedPowerBI.defaultProps = {
  startupHash: '',
  isComparison: false,
  loginObject: {},
  embedTokenReport: ''
}

export default EmbedPowerBI;
