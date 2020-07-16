import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tabs, Tab, Card } from '@material-ui/core';

import InfoTab from './info';
import ContactTab from './contact';
import DashboardTemplate from '../Template/template';
import { FlexView, Text } from '../../../styles/global';
import { Colors } from '../../../lib/theme';

import { dashboardActions } from '../../../redux/actions';

const styles = {
  flexContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    padding: '0px 10px',
    boxShadow: 'none',
    border: '1px solid rgba(0,0,0,0.1)'
  },
  tabBar: {
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  tabPadding: {
    padding: '20px 10px'
  }
}

class CompanyDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      index: 99,
    }
  }

  componentDidMount() {

    // It's called ID in the param but it's a hashcode
    const hash = this.props.match.params.id;

    if (!this.props.loginObject.isLogged) {
      this.props.history.push('/dashboard/login');

    } else {
      this.props.fetchCompanyDetail(hash);
    }
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  onChangeIndex = (index, category) => {

    this.setState({index});

    this.props.history.push('/dashboard/' + category);
  }


  render() {

    const { value, index } = this.state;

    const { classes, history, selected_company } = this.props;

    return(
      <DashboardTemplate index={index} onChangeIndex={this.onChangeIndex} history={history}>
        <Grid container className={classes.flexContainer}>

          <Grid container justify="space-between" style={{alignItems: 'center'}}>
            <Grid item xs={12} md={4}>
              <Text
                fontSize={26}
                color={Colors.text}
                padding="20px"
              >
                Company detail: {selected_company.company_name}
              </Text>
            </Grid>
            <Grid item xs={12} md={4} style={{padding: 20}}>
              <FlexView justify="flex-end">
                <Link className="btn btn-outline btn-medium" to="/dashboard/companies">Go back to companies list</Link>
              </FlexView>
            </Grid>
          </Grid>

          <Grid container style={{padding: 20, marginBottom: 20}} className={classes.flexContainer}>

            <Card className={classes.card}>
              <Tabs value={value} onChange={this.handleTabChange} className={`${classes.tabBar} tabsWrapper`}>
                <Tab label="General information" />
                <Tab label="Contact information" />
              </Tabs>

              <div className={classes.tabPadding}>
                {value === 0 && <InfoTab />}
                {value === 1 && <ContactTab />}
              </div>
            </Card>

          </Grid>

        </Grid>
      </DashboardTemplate>
    )
  }
}

const mapStateToProps = (state) => ({
  selected_company: state.dashboardReducer.selected_company,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  fetchCompanyDetail: dashboardActions.fetchCompanyDetail,
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CompanyDetail));
