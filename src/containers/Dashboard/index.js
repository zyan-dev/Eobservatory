import * as React from 'react';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import qs from 'query-string';
import { screenActions, optionActions, dashboardActions } from '../../redux/actions';
import Login from './Login';
import CampaignsList from './Campaigns';
import EmbedReport from './Report';
import EmbedReportComparison from './Report/comparison';
import CompaniesList from './CompaniesList';
import NotFoundPage from '../NotFoundPage';
import DashboardTemplate from './Template/template';
import { getPowerBIDefinitions } from '../../lib/operators';


class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      redirect: 'campaigns'
    }
  }

  componentDidMount() {

    const menu = this.props.match.params.menu;

    const { loginObject } = this.props;

    let reportId = getPowerBIDefinitions(loginObject.userName).reportId;

    if (menu === 'campaigns') {
      this.setState({ index: 1 });

    } else if (menu === 'report') {
      this.setState({ index: 2 });

    } else if (menu === 'report_comparison') {
      this.setState({ index: 4 });

    } else if (menu === 'companies') {
      this.setState({ index: 3 });

    } else if (menu === 'login') {

      const redirect = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).redirect;

      this.setState({ index: 0 });

      if (redirect !== undefined) {
        this.setState({ redirect });
      }

    } else {
      this.setState({ index: -1 });
    }

    // Listen URL change
    this.listenUrlChange = this.props.history.listen((location) => {

      if (location.pathname.indexOf('/campaigns') > -1)
        this.setState({index: 1});

      else if (location.pathname.indexOf('/report_comparison') > -1)
        this.setState({index: 4});

      else if (location.pathname.indexOf('/report') > -1)
        this.setState({index: 2});

      else if (location.pathname.indexOf('/companies') > -1)
        this.setState({index: 3});

      else if (location.pathname.indexOf('/login') > -1)
        this.setState({index: 0});

      else this.setState({index: -1});
    });

    this.props.getCountryList();
    this.props.getRegions();

    this.props.getPowerBIToken(reportId);

    if (loginObject.userName === 'Innoenergy') {
      this.props.getPowerBITokenForComparison();
    }
  }

  componentWillUnmount() {
    this.listenUrlChange();
  }

  onChangeIndex = (index, category) => {

    this.setState({index}, () => {
      this.props.history.push(`/dashboard/${category}`);
    });
  }

  onRedirect = () => {

    const { redirect } = this.state;

    if (redirect === 'campaigns') {
      this.onChangeIndex(1, 'campaigns');

    } else if (redirect === 'report') {
      this.onChangeIndex(2, 'report');

    } else if (redirect === 'report_comparison') {
      this.onChangeIndex(4, 'report_comparison');

    } else if (redirect === 'companies') {
      this.onChangeIndex(3, 'companies');

    } else {
      this.onChangeIndex(1, 'campaigns');
    }
  }

  redirectToLogin = (redirect) => {

    this.setState({
      index: 0,
      redirect
    });

    this.props.history.push(`/dashboard/login?redirect=${redirect}`);
  }


  render() {

    const { index } = this.state;
    const { history } = this.props;

    return(
      <DashboardTemplate index={index} onChangeIndex={this.onChangeIndex} history={history}>
        {index === -1 &&
          <NotFoundPage history={history}/>
        }

        {index === 0 &&
          <Login
            redirect={this.onRedirect}
          />
        }

        {index === 1 &&
          <CampaignsList
            redirectToLogin={() => this.redirectToLogin('campaigns')}
          />
        }

        {index === 2 &&
          <EmbedReport
            redirectToLogin={() => this.redirectToLogin('report')}
          />
        }

        {index === 4 &&
          <EmbedReportComparison
            redirectToLogin={() => this.redirectToLogin('report_comparison')}
          />
        }

        {index === 3 &&
          <CompaniesList
            redirectToLogin={() => this.redirectToLogin('companies')}
          />
        }
      </DashboardTemplate>
    )
  }
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  visibleSideBar: state.screenReducer.visibleSideBar,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  setVisibleSideBar: screenActions.setVisibleSideBar,
  getCountryList: optionActions.getCountryList,
  getRegions: optionActions.getRegions,
  getPowerBIToken: dashboardActions.getPowerBIToken,
  getPowerBITokenForComparison: dashboardActions.getPowerBITokenForComparison
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Dashboard));
