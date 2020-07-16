import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ReactTable from 'react-table'
import Moment from 'react-moment';
import { FlexView, Text } from '../../../styles/global';
import { dashboardActions } from '../../../redux/actions';
import { Colors } from '../../../lib/theme';
import DashboardTemplate from '../Template/template';
import { CustomInput } from '../../../components';

const styles = {
  flexContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  headerText: {
    color: Colors.text,
    fontSize: 16,
    padding: '0px 5px',
    fontWeight: 'bold'
  },
  cell: {
    color: Colors.text,
    fontSize: 16,
    padding: '20px 0px',
    width: '100%',
  },
  hideCell: {
    display: 'none'
  }
}

class CampaignDetail extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      index: 10,
      surveyName: '',
      survey_launch_id: this.props.match.params.id
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    this.props.fetchSurveyDetail(id);

    this.setState({
      surveyName: this.getSurveyName(id)
    })
  }

  getSurveyName = (id) => {

    var filteredSurvey;

    filteredSurvey = this.props.surveys.filter(survey => {

        return survey.survey_launch_id === Number(id);
    });

    return filteredSurvey[0].survey_name;
  }

  onChangeIndex = (index, category) => {

    this.setState({index}, () => {
      this.props.history.push('/dashboard/' + category);
    });
  }

  formatLink = (props) => {
    const domain_url = 'https://eobservatory.innoenergy.com/#/'
    const path = 'survey'
    const token = props.value
    let p_value = ''

    if (props.original.country_name === 'France') {
      p_value = 'GreenUnivers'
    } else if (props.original.country_name === 'Spain') {
      p_value = 'EnergiasRenovables'
    } else if (props.original.country_name === 'Switzerland') {
      p_value = 'CleanTechAlps'
    } else {
      p_value = 'Innoenergy'
    }

    return domain_url + path + '/' + token + '&P=' + p_value
  }

  render() {

    const { index } = this.state;

    const { classes, survey_detail, history } = this.props;

    const cellStyle = {
      headerStyle: {height: 60, display: 'flex', alignItems: 'center'},
      style: {height: 70, display: 'flex', alignItems: 'center', padding: '0 10px'},
    }

    const columns = [
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Company</p>,
        Cell: props => <span>{props.value}</span>,
        filterable: true,
        filterMethod: (filter, row) => {
          let regexToUse = new RegExp(filter.value, 'i');

          return (regexToUse).test(row.company);
        },
        Filter: ({filter, onChange}) => (
          <Grid container>
            <CustomInput
              className=""
              type="text"
              value={filter ? filter.value : ''}
              placeholder="search company name"
              onChange={event => onChange(event.target.value)}
            />
          </Grid>
        ),
        accessor: 'company'
      },
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Registered Email</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'registered_email',
      },
      {
        ...cellStyle,
        minWidth: 80,
        Header: <p className={classes.headerText}>Country</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'country_name',
      },
      {
        ...cellStyle,
        minWidth: 80,
        Header: <p className={classes.headerText}>% Completion</p>,
        Cell: props => <span className={classes.cell}>{`${Math.ceil(props.value)} %`}</span>,
        filterable: true,
        filterMethod: (filter, row) => {
          return (filter.value <= row['%completion']);
        },
        Filter: ({filter, onChange}) => (
          <Grid container>
            <CustomInput
              type="text"
              value={filter ? filter.value : ''}
              placeholder="min value"
              onChange={event => onChange(event.target.value)}
            />
          </Grid>
        ),
        accessor: '%completion'
      },
      {
        ...cellStyle,
        minWidth: 80,
        Header: <p className={classes.headerText}>Completed</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'completed'
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Link</p>,
        Cell: props => <span className={classes.cell}>{this.formatLink(props)}</span>,
        accessor: 'Link'
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Last saved at</p>,
        Cell: props => <Moment className={props.value ? classes.cell : classes.hideCell} element={Text} format="DD/MM/YYYY HH:MM" date={new Date(props.value)} />,
        accessor: 'Last_saved_at'
      },
    ];


    return (
      <DashboardTemplate index={index} onChangeIndex={this.onChangeIndex} history={history}>
        <Grid container className={classes.flexContainer}>

          <Grid container justify="space-between" style={{alignItems: 'center'}}>
            <Grid item xs={12} md={4}>
              <Text
                fontSize={26}
                color={Colors.text}
                padding="20px"
              >
                {this.state.surveyName} Responses
              </Text>
            </Grid>
            <Grid item xs={12} md={4} style={{padding: 20}}>
              <FlexView justify="flex-end">
                <Link className="btn btn-outline btn-medium" to="/dashboard/campaigns">Go back to campaigns list</Link>
              </FlexView>
            </Grid>
          </Grid>

          <Grid container style={{padding: 20, marginBottom: 20}} className={classes.flexContainer}>
            <ReactTable
              data={survey_detail}
              columns={columns}
              defaultSorted={[
                {
                  id: "Last_saved_at",
                  desc: true
                }
              ]}
              defaultPageSize={50}
              style={{width: '100%', height: '100%'}}
              previousText={
                <Text color={Colors.blue} align="center" fontSize={20}>Previous</Text>
              }
              nextText={
                <Text color={Colors.blue} align="center" fontSize={20}>Next</Text>
              }
            />
          </Grid>
        </Grid>
      </DashboardTemplate>
    )
  }
}

const mapStateToProps = (state) => ({
  surveys: state.dashboardReducer.surveys,
  survey_detail: state.dashboardReducer.survey_detail,
  visibleSideBar: state.screenReducer.visibleSideBar,
});

const mapDispatchToProps = ({
  fetchSurveyDetail: dashboardActions.fetchSurveyDetail
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CampaignDetail));
