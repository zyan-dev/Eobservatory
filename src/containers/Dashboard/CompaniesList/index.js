import * as React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {withSnackbar} from 'notistack';
import Moment from 'react-moment';
import {Grid, Icon} from '@material-ui/core';
import ReactTable from 'react-table'

import {Text, FlexView} from '../../../styles/global';
import {Colors} from '../../../lib/theme';
import {dashboardActions} from '../../../redux/actions';
import {CustomInput} from '../../../components';
import {removeDuplicates} from '../../../lib/operators';


const styles = {
  headerText: {
    color: Colors.gray,
    fontSize: 12,
    padding: '0px 5px',
    textAlign: 'left'
  },
  companyName: {
    color: Colors.green,
    fontSize: 16,
    padding: '20px 5px'
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
  filterInput: {
    marginLeft: 20
  },
  fileInput: {
    width: 0,
    height: 0
  }
}

class CompaniesList extends React.Component {

  componentDidMount() {

    if (!this.props.loginObject.isLogged) {
      this.props.redirectToLogin();

    } else {
      this.props.fetchCompanies();
    }
  }

  onChangeFile(event) {

    const _this = this;

    let extension,
        selectedFile;

    if (event.target.files.length === 0) {

      return;
    }

    extension = event.target.files[0].type;

    if (extension.indexOf('spreadsheet') < 0) {

      this.props.enqueueSnackbar('Invalid File!', {variant: 'error'})

      return;
    }

    selectedFile = event.target.files[0];

    _this.props.uploadCompanyCSV(selectedFile, response => {

      this.handleExcelResponseMessages(response);

      this.props.fetchCompanies();
    });

    this.props.enqueueSnackbar('Companies CSV file uploaded correctly', {variant: 'success'})
  }

  handleExcelResponseMessages = response => {

    let omittedCount = 0;

    removeDuplicates(response.messages, 'id').forEach(msg => {
      if (msg.message.indexOf('already exists') !== -1) {
        omittedCount++;
      }
    });

    this.props.enqueueSnackbar(`${response.data ? response.data.length : 0} Companies had been added. ${omittedCount} Duplicates have been omitted.`, {
      variant: 'info',
      autoHideDuration: 8000
    });
  }

  getCompanyHashcode = name => {

    const filtered = this.props.companies.filter(company => {

      return company.company_name === name;
    });

    return filtered[0].hashcode;
  }

  getCountryFromID = id => {

    let selectedCountry = this.props.options.countryList.filter(country => {
      return country.value === id;
    });

    if (selectedCountry.length) {
      return selectedCountry[0].label;
    }

    return '';
  }


  render() {

    const {classes, companies} = this.props;

    const cellStyle = {
      headerStyle: {height: 60, display: 'flex', alignItems: 'center'},
      style: {height: 70, display: 'flex', alignItems: 'center', padding: '0 10px'},
    }

    const columns = [
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Company</p>,
        Cell: props => <Link
            to={"/dashboard/company_detail/" + this.getCompanyHashcode(props.value)}>{props.value}</Link>,
        filterable: true,
        filterMethod: (filter, row) => {
          let regexToUse = new RegExp(filter.value, 'i');

          return (regexToUse).test(row.company_name);
        },
        Filter: ({filter, onChange}) => (
            <Grid container>
              <CustomInput
                  type="text"
                  value={filter ? filter.value : ''}
                  placeholder="search company name"
                  onChange={event => onChange(event.target.value)}
              />
            </Grid>
        ),
        accessor: 'company_name'
      },
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Partner</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        filterable: true,
        filterMethod: (filter, row) => {
          let regexToUse = new RegExp(filter.value, 'i');

          return (regexToUse).test(row.partner);
        },
        Filter: ({filter, onChange}) => (
            <Grid container>
              <CustomInput
                  type="text"
                  value={filter ? filter.value : ''}
                  placeholder="search partner name"
                  onChange={event => onChange(event.target.value)}
              />
            </Grid>
        ),
        accessor: 'partner'
      },
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>Is Innoenergy Startup</p>,
        Cell: props => <span className={classes.cell}>{props.value ? "Yes" : "No"}</span>,
        filterable: true,
        filterMethod: (filter, row) => {
          return filter.value === "Any"
              || (filter.value === "Yes" && row.is_innoenergy_startup)
              || (filter.value === "No" && !row.is_innoenergy_startup);
        },
        Filter: ({filter, onChange}) => (
            <Grid container>
              <CustomInput
                  type="select"
                  value={filter ? filter.value : ""}
                  options={["Any", "No", "Yes"]}
                  placeholder="search Innoenergy startups"
                  onChange={event => onChange(event.target.value)}
              />
            </Grid>
        ),
        accessor: 'is_innoenergy_startup'
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Country</p>,
        Cell: props => <span className={classes.cell}>{this.getCountryFromID(props.value)}</span>,
        accessor: 'country_id',
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Activity</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'activity',
      },
      {
        ...cellStyle,
        minWidth: 200,
        Header: <p className={classes.headerText}>User email</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        filterable: true,
        filterMethod: (filter, row) => {
          let regexToUse = new RegExp(filter.value, 'i');

          return (regexToUse).test(row.user_email);
        },
        Filter: ({filter, onChange}) => (
            <Grid container>
              <CustomInput
                  type="text"
                  value={filter ? filter.value : ''}
                  placeholder="search user email"
                  onChange={event => onChange(event.target.value)}
              />
            </Grid>
        ),
        accessor: 'user_email'
      },
      {
        ...cellStyle,
        minWidth: 80,
        Header: <p className={classes.headerText}>Foundation year</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'year_incorporated'
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Website</p>,
        Cell: props => <span className={classes.cell}>{props.value}</span>,
        accessor: 'website'
      },
      {
        ...cellStyle,
        minWidth: 160,
        Header: <p className={classes.headerText}>Register Date</p>,
        Cell: props => <Moment className={classes.cell} element={Text} format="DD MMM YYYY HH:MM"
                               date={new Date(props.value)}/>,
        accessor: 'register_date'
      }
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
                Companies
              </Text>
            </Grid>

            <Grid item xs={12} md={4} style={{padding: 20}}>
              <FlexView justify="flex-end">
                <label>
                  <input style={{position: 'absolute'}} type="file" ref={ref => this.fileEvent = ref}
                         className={classes.fileInput} onChange={event => this.onChangeFile(event)}/>
                  <div className="btn btn-medium">
                    <Icon style={{marginRight: '10px'}}>arrow_upward</Icon>
                    Import from Excel file
                  </div>
                </label>
              </FlexView>
            </Grid>
          </Grid>

          <Grid container style={{padding: 20, marginBottom: 20}} className={classes.flexContainer}>
            <ReactTable
                data={companies}
                columns={columns}
                defaultPageSize={10}
                style={{width: '100%', height: '100%'}}
            />
          </Grid>
        </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  loginObject: state.dashboardReducer.loginObject,
  companies: state.dashboardReducer.companies,
  options: state.optionReducer
});

const mapDispatchToProps = ({
  fetchCompanies: dashboardActions.fetchCompanies,
  uploadCompanyCSV: dashboardActions.uploadCompanyCSV
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(CompaniesList)));
