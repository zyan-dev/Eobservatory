import * as React from 'react';
import {connect} from 'react-redux';
import {Grid} from '@material-ui/core';
import {withSnackbar} from 'notistack';

import {Route} from 'react-router-dom';
import {CustomButton, CustomInput} from '../../../components';

import {dashboardActions} from '../../../redux/actions';
import ConfirmDialog from "../../../components/ConfirmDialog";

class ContactTab extends React.Component {

  state = {
    dialogConfirmDeleteIsOpen: false
  };

  handleChange = name => event => {

    this.props.updateSelectedCompany({
      [name]: event.target.value
    });
  };

  handleBooleanChange = name => event => {

    this.props.updateSelectedCompany({
      [name]: event.target.value === 'Yes',
    });
  };

  onSave = () => {

    const {selected_company} = this.props;

    this.props.saveSelectedCompany(selected_company, res => {

      if (res === 'success') {
        this.props.enqueueSnackbar('Updated successfully!', {variant: 'success'});

      } else {
        this.props.enqueueSnackbar('Update Failed!', {variant: 'error'})
      }
    });
  };

  onDelete = (routeHistory) => {

    const {selected_company} = this.props;

    this.props.deleteSelectedCompany(selected_company, res => {

      if (res === 'success') {
        this.props.enqueueSnackbar('Deleted successfully!', {variant: 'success'});
        routeHistory.push('/dashboard/companies');
      } else {
        this.props.enqueueSnackbar('Delete Failed!', {variant: 'error'});
      }
      this.closeConfirmDialog();
    });
  };

  openConfirmDialog = () => {
    this.setState({dialogConfirmDeleteIsOpen: true});
  };

  closeConfirmDialog = () => {
    this.setState({dialogConfirmDeleteIsOpen: false});
  };

  render() {

    const {selected_company} = this.props;

    return (
        <Grid container>
          <Grid container padding="8">

            <Grid item xs={12} md={3} lg={2}>
              <Grid container>
                <CustomInput
                    label={'NAME'}
                    value={selected_company.user_name || ''}
                    onChange={this.handleChange('user_name')}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={3} lg={2}>
              <Grid container>
                <CustomInput
                    label={'LAST NAME'}
                    value={selected_company.user_last_name || ''}
                    onChange={this.handleChange('user_last_name')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={6} lg={4}>
              <Grid container>
                <CustomInput
                    label={'POSITION'}
                    value={selected_company.position || ''}
                    onChange={this.handleChange('position')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={6} lg={4}>
              <Grid container>
                <CustomInput
                    type="select"
                    label={'IS_INNOENERGY_STARTUP'}
                    value={selected_company.is_innoenergy_startup ? 'Yes' : 'No'}
                    options={['No', 'Yes']}
                    onChange={this.handleBooleanChange('is_innoenergy_startup')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={6} lg={4}>
              <Grid container>
                <CustomInput
                    label={'EMAIL'}
                    value={selected_company.user_email || ''}
                    onChange={this.handleChange('user_email')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6} md={2}>
              <CustomButton
                  buttonClass="btn btn-medium"
                  text="Delete contact"
                  onPress={this.openConfirmDialog}
              />
            </Grid>
            <Route render={({history: routeHistory}) => (
                <ConfirmDialog
                    contentText={"Are you sure you want to delete this company permanently from your list?"}
                    onCancel={this.closeConfirmDialog}
                    onConfirm={() => this.onDelete(routeHistory)}
                    open={this.state.dialogConfirmDeleteIsOpen}
                />)}
            />
            <Grid item xs={6} md={2}>
              <CustomButton
                  buttonClass="btn btn-medium"
                  text="Save changes"
                  onPress={this.onSave}
              />
            </Grid>

          </Grid>

        </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  selected_company: state.dashboardReducer.selected_company
});

const mapDispatchToProps = ({
  updateSelectedCompany: dashboardActions.updateSelectedCompany,
  deleteSelectedCompany: dashboardActions.deleteSelectedCompany,
  saveSelectedCompany: dashboardActions.saveSelectedCompany
});

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(ContactTab));
