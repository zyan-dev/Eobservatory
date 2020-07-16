import * as React from 'react';
import { connect } from 'react-redux';
import { Link  } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Moment from 'react-moment';
import ReactTable from 'react-table'
import Popover from 'react-popover';
import { Grid, Icon, Button } from '@material-ui/core';
import { Text, FlexView, Row, GraySText } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { CustomButton, IconButton } from '../../../components';
import { optionActions, dashboardActions } from '../../../redux/actions';
import { PopOverView } from '../../../styles/dashboard';
import NewCampaignModal from './modal_new_campaign';
import SendReminderModal from './modal_send_reminder';
import SendResultsModal from './modal_send_results';
import { getPowerBIDefinitions } from '../../../lib/operators';
import { URL_GET_DASHBOARD_SURVEY_RESPONSES_EXCEL_DIRECT } from '../../../redux/types';

const styles = {
  headerText: {
    color: Colors.gray,
    fontSize: 12,
    padding: '0px 5px',
    textAlign: 'left'
  },
  cell: {
    color: Colors.text,
    fontSize: 16,
    padding: '20px 0px',
    width: '100%'
  },
  flexContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  popup: {
    padding: 5,
    position: 'relative',
    borderRadius: 4,
    backgroundColor: '#F2F2F2',
    border: '1px solid #E2E2E2'
  },
  popupIcon: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 20
  },
  popupTip: {
    position: 'absolute',
    top: -5,
    left: '50%',
    backgroundColor: '#F2F2F2',
    width: 8,
    height: 8,
    transform: 'rotate(45deg)',
    marginLeft: -4,
    borderTop: '1px solid #E2E2E2',
    borderLeft: '1px solid #E2E2E2',
  },
  popupButton: {
    padding: '0px 5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start'
  },
  popupButtonDisabled: {
    padding: '0px 5px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    opacity: 0.7,
    pointerEvents: 'none'
  },
  downloadText: {
    textDecoration: 'none'
  }
}

class CampaignsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      actionsPopoverId: 0,
      showPopOverView: false,
      popFormIndex: 0,
      selected: {},
      selectedSurveyId: ''
    }
  }

  componentDidMount() {

    const { loginObject } = this.props;

    let reportId = getPowerBIDefinitions(loginObject.userName).reportId;

    if (!loginObject.isLogged) {
      this.props.redirectToLogin();

    } else {

      this.props.fetchSurveys();
      this.props.fetchCompanies();

      this.props.getPowerBIToken(reportId);
      this.props.getCountryList();
      this.props.getRegions();

      if (loginObject.userName === 'Innoenergy') {
        this.props.getPowerBITokenForComparison();
      }
    }
  }

  onAddSurvey = () => {

    this.setState({
      showPopOverView: true,
      popFormIndex: 1,
      actionsPopoverId: -1
    })
  }

  onActionsButtonClick = id => {

    const { actionsPopoverId } = this.state;

    if (actionsPopoverId === id) {
      // Already open so we do nothing
      return;
    }

    this.setState({
      actionsPopoverId: id
    });
  }

  getSelectedSurvey = id => {
    let filteredSurvey;

    filteredSurvey = this.props.surveys.filter(survey => {
        return survey.survey_launch_id === id;
    });

    return filteredSurvey[0] || {};
  }

  checkCampaignIsFromUser = id => {
    const { loginObject } = this.props;

    let campaignOwnerName = this.getSurveyOwnerName(id);

    let nameIsMatching = false;

    if (campaignOwnerName && loginObject.userName) {
      nameIsMatching = campaignOwnerName.includes(loginObject.userName);
    }

    // Hardcoded for ERenovables and Andorra
    if ((campaignOwnerName === 'Energías Renovables' && loginObject.userName === 'ERenovables') ||
      (campaignOwnerName === 'Andorra Renovables' && loginObject.userName === 'Andorra')) {

      nameIsMatching = true;
    }

    return nameIsMatching;
  }

  sendReminderTo = id => {

    let selectedSurvey = this.getSelectedSurvey(id);

    this.setState({
      showPopOverView: true,
      popFormIndex: 2,
      selectedSurveyId: selectedSurvey.survey_launch_id,
      actionsPopoverId: -1
    });
  }

  sendResults = id => {

    let selectedSurvey = this.getSelectedSurvey(id);

    this.setState({
      showPopOverView: true,
      popFormIndex: 3,
      selectedSurveyId: selectedSurvey.survey_launch_id,
      actionsPopoverId: -1
    });
  }

  toggleLockState = id => {

    const callback = success => {

      if (success) {
        this.props.fetchSurveys();
        this.props.enqueueSnackbar(`Campaign lock state changed`, {variant: 'success'});
      } else {
        this.props.enqueueSnackbar(`There was an error changing the campaign lock state, please try again later.`, {variant: 'error'});
      }
    }

    let selectedSurvey = this.getSelectedSurvey(id),
      survey_launch_data = {
        campaign_name: selectedSurvey.survey_name,
        survey_date_begins: selectedSurvey.created_on,
        survey_date_ends: selectedSurvey.survey_date_ends,
        survey_of_year: selectedSurvey.survey_of_year,
        survey_id: 1
      };

    if (selectedSurvey.survey_date_ends === null) {
      // It's open -> proceed to close it
      this.props.changeSurveyLockState(false, survey_launch_data, selectedSurvey.survey_launch_id, callback);

    } else {
      // It's closed -> proceed to open it
      this.props.changeSurveyLockState(true, survey_launch_data, selectedSurvey.survey_launch_id, callback)
    }

    // Close actions popover
    this.setState({
      actionsPopoverId: -1
    });

  }

  getSurveyName = id => {

    let selectedSurvey = this.getSelectedSurvey(id);

    return selectedSurvey.survey_name;
  }

  getSurveyOwnerName = id => {

    let selectedSurvey = this.getSelectedSurvey(id);

    return selectedSurvey.partner_name;
  }

  surveyHasReponses = id => {
    let selectedSurvey = this.getSelectedSurvey(id);

    return selectedSurvey.rate_of_response > 0;
  }

  isSurveyOpen = id => {
    let selectedSurvey = this.getSelectedSurvey(id);

    return selectedSurvey.survey_date_ends === null;
  }


  render() {

    const { actionsPopoverId, showPopOverView, popFormIndex, selectedSurveyId } = this.state;

    const { classes, surveys, loginObject } = this.props;

    const cellStyle = {
      headerStyle: {height: 60, display: 'flex', alignItems: 'center'},
      style: {height: 70, display: 'flex', alignItems: 'center', padding: '0 10px'},
    }

    const columns = [
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Survey Name</p>,
        Cell: props => <Link to={"/dashboard/campaign_detail/" + props.value}>{this.getSurveyName(props.value)}</Link>,
        accessor: 'survey_launch_id'
      },
      {
        ...cellStyle,
        minWidth: 100,
        Header: <p className={classes.headerText}>Results from</p>,
        Cell: props => <span className={classes.cell}>{props.value - 1}</span>,
        accessor: 'survey_of_year',
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Partner</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'partner_name',
      },
      {
        ...cellStyle,
        minWidth: 80,
        Header: <p className={classes.headerText}>Visits</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'visits'
      },
      {
        ...cellStyle,
        minWidth: 90,
        Header: (
          <div>
            <p className={classes.headerText}>Incompleted</p>
            <p className={classes.headerText}>surveys</p>
          </div>
        ),
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'incomplete_surveys'
      },
      {
        ...cellStyle,
        minWidth: 90,
        Header: (
          <div>
            <p className={classes.headerText}>Completed</p>
            <p className={classes.headerText}>surveys</p>
          </div>
        ),
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'surveys_completed'
      },
      {
        ...cellStyle,
        minWidth: 90,
        Header: (
          <div>
            <p className={classes.headerText}>Rate of</p>
            <p className={classes.headerText}>response</p>
          </div>
        ),
        Cell: props => <span className={classes.cell}>{`${Math.ceil(props.value)} %`}</span>,
        accessor: 'rate_of_response'
      },
      {
        ...cellStyle,
        minWidth: 90,
        Header: (
          <div>
            <p className={classes.headerText}>Average</p>
            <p className={classes.headerText}>time</p>
          </div>
        ),
        Cell: props => <span className={classes.cell}>{isNaN(props.value) ? props.value : Math.round(props.value)}</span>,
        accessor: 'avg_time'
      },
      {
        ...cellStyle,
        minWidth: 100,
        Header: <span className={classes.headerText}>Created on</span>,
        Cell: props => <Moment className={classes.cell} element={Text} format="DD MMM YYYY HH:MM" date={new Date(props.value)} />,
        accessor: 'created_on'
      },
      {
        ...cellStyle,
        minWidth: 70,
        Header: <span className={classes.headerText}>Actions</span>,
        sortable: false,
        Cell: props => (

          <Popover
            isOpen={actionsPopoverId === props.value}
            preferPlace="start"
            place="below"
            tipSize={0.1}
            onOuterAction={() => this.setState({ actionsPopoverId: -1 })}
            body={
              <div className={classes.popup}>
                <div>
                  <Button className={classes.popupButton} onClick={() => this.toggleLockState(props.value)}>
                    <Row>
                      <Icon className={classes.popupIcon}>{this.isSurveyOpen(props.value) ? 'lock' : 'lock_open'}</Icon>
                      <GraySText> {this.isSurveyOpen(props.value) ? 'Close survey' : 'Open survey'}</GraySText>
                    </Row>
                  </Button>
                </div>
                <div>
                  <Button className={!this.surveyHasReponses(props.value) ? classes.popupButtonDisabled : classes.popupButton}>
                    <Row>
                      <Icon className={classes.popupIcon}>save_alt</Icon>
                      {/* eslint-disable max-len, react/jsx-no-target-blank */}
                      <a className={classes.downloadText} href={`${URL_GET_DASHBOARD_SURVEY_RESPONSES_EXCEL_DIRECT}?survey_launch_id=${props.value}&Token=${loginObject.token}`} download target="_blank"><GraySText> Download results</GraySText></a>
                      {/* eslint-enable max-len, react/jsx-no-target-blank */}
                    </Row>
                  </Button>
                </div>
                <div>
                  <Button className={this.checkCampaignIsFromUser(props.value) ? classes.popupButton : classes.popupButtonDisabled} onClick={() => this.sendReminderTo(props.value)}>
                    <Row>
                      <Icon className={classes.popupIcon}>send</Icon>
                      <GraySText> Send reminder</GraySText>
                    </Row>
                  </Button>
                </div>
                <div>
                  <Button className={!this.isSurveyOpen(props.value) ? classes.popupButton : classes.popupButtonDisabled} onClick={() => this.sendResults(props.value)}>
                    <Row>
                      <Icon className={classes.popupIcon}>equalizer</Icon>
                      <GraySText> Send results</GraySText>
                    </Row>
                  </Button>
                </div>

                <div className={classes.popupTip} />
              </div>
            }
          >
            <IconButton icon="more_horiz" backgroundColor="transparent" color={Colors.gray} onPress={() => this.onActionsButtonClick(props.value)}/>
          </Popover>
        ),
        accessor: 'survey_launch_id'
      },
    ]

    return (
      <Grid container className={classes.flexContainer}>
        <Grid container justify="space-between" style={{alignItems: 'center'}}>
          <Grid item xs={12} md={4}>
            <Text
              fontSize={26}
              color={Colors.text}
              padding="20px"
            >
              Campaigns
            </Text>
          </Grid>
          <Grid item xs={12} md={4} style={{padding: 20}}>
            <FlexView justify="flex-end">
              <CustomButton
                color={Colors.lightgray}
                backgroundColor={Colors.blue}
                icon="add"
                text="New Campaign"
                onPress={this.onAddSurvey}
                style={{margin: 0}}
                buttonClass="btn btn-medium"
              />
            </FlexView>
          </Grid>
        </Grid>
        <Grid container style={{padding: 20, marginBottom: 20}} className={classes.flexContainer}>
          <ReactTable
            data={surveys}
            columns={columns}
            defaultSorted={[
              {
                id: "created_on",
                desc: true
              }
            ]}
            defaultPageSize={10}
            style={{width: '100%', height: '100%'}}
            previousText={
              <Text color={Colors.blue} align="center" fontSize={20}>Previous</Text>
            }
            nextText={
              <Text color={Colors.blue} align="center" fontSize={20}>Next</Text>
            }
          />
        </Grid>
        {
          showPopOverView &&
          <PopOverView className="modalContainer">
            { popFormIndex === 1 &&
              <NewCampaignModal
                onClose={() => this.setState({popFormIndex: 0, showPopOverView: false})}
              />
            }
            { popFormIndex === 2 &&
              <SendReminderModal
                selectedSurveyId = {selectedSurveyId}
                onClose={() => this.setState({popFormIndex: 0, showPopOverView: false})}
              />
            }
            { popFormIndex === 3 &&
              <SendResultsModal
                selectedSurveyId = {selectedSurveyId}
                onClose={() => this.setState({popFormIndex: 0, showPopOverView: false})}
              />
            }
          </PopOverView>
        }

      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  surveys: state.dashboardReducer.surveys,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  fetchSurveys: dashboardActions.fetchSurveys,
  fetchCompanies: dashboardActions.fetchCompanies,
  changeSurveyLockState: dashboardActions.changeSurveyLockState,
  getCountryList: optionActions.getCountryList,
  getRegions: optionActions.getRegions,
  getPowerBIToken: dashboardActions.getPowerBIToken,
  getPowerBITokenForComparison: dashboardActions.getPowerBITokenForComparison
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(CampaignsList)));
