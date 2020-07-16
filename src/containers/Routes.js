import * as React from 'react';

import { HashRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { screenActions } from '../redux/actions';

import LandingPage from './LandingPage';
import PrivacyPolicy from './PrivacyPolicy';

import CompanyInfo from './Survey/CompanyInfo';
import Survey from './Survey/Questionnaire/index';
import SurveyEnd from './Survey/SurveyEnd';
import SurveyNotValid from './Survey/SurveyNotValid';

import Dashboard from './Dashboard';
import CampaignDetail from './Dashboard/Campaign';
import CompanyDetail from './Dashboard/Company';

import StartupReport from './StartupReport/index';

// import NotFoundPage from './NotFoundPage';


class Router extends React.Component {

  constructor(props) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.props.setDimension({
        width: window.innerWidth,
        height: window.innerHeight
    });
  }

  render() {
    return(
      <HashRouter>
        <div>
          <Route exact path="/" component={LandingPage}/>
          <Route exact path="/privacy_policy" component={PrivacyPolicy}/>
          <Route exact path="/survey" component={CompanyInfo}/>
          <Route exact path="/survey/:hash_key" component={CompanyInfo}/>
          <Route exact path="/survey/:index/:hash_key" component={Survey}/>
          <Route exact path="/survey_not_found" component={SurveyNotValid}/>
          <Route exact path="/survey_completed" component={SurveyEnd}/>
          <Route exact path="/startup_report/:hash_key/:partner_name?" component={StartupReport}/>
          <Route exact path="/dashboard/:menu" component={Dashboard}/>
          <Route exact path="/dashboard/campaign_detail/:id" component={CampaignDetail}/>
          <Route exact path="/dashboard/company_detail/:id" component={CompanyDetail}/>
          {/* <Route exact path="*" component={NotFoundPage} /> */}
        </div>
      </HashRouter>
    )
  }
}

const mapDispatchToProps = ({
  setDimension: screenActions.setDimension
})

export default connect(null, mapDispatchToProps)(Router);
