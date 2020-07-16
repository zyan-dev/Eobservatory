import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Icon } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

import { Text, FlexView } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { GreenLine, PopOverCloseIconView } from '../../../styles/dashboard';
import { AlertDialog, CustomInput, CustomButton, IconButton } from '../../../components';

import { checkMailingCampaignsFields } from '../../../lib/operators';
import { dashboardActions } from '../../../redux/actions';

const styles = {
  container: {
    paddingTop: 120,
  },
  sentIcon: {
    color: Colors.lightgray,
    fontSize: 250
  },
  buttonDisabled: {
    opacity: 0.7,
    pointerEvents: 'none'
  }
}

class NewCampaignModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      year: new Date().getFullYear().toString(),
      subject: '',
      email_control: '',
      openDialog: false,
      testSent: false,
      sent: false,
      error: {},
      survey_launch_id: '',
      editorState: EditorState.createEmpty(),
      surveyAlreadyExist: false // this.checkCampaignYear(new Date().getFullYear())
    }
  }

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleEditorChange = editorState => {

    this.setState({
      editorState
    });

    this.checkEditorInputIsValid();
  };

  getDraftInHtmlFormat = () => {

    const { editorState } = this.state;

    const rawContentState = convertToRaw(editorState.getCurrentContent());

    // Remove line breaks
    return draftToHtml(rawContentState).replace(/(\r\n|\n|\r)/gm, ' ');
  }

  checkThisInputIsValid = key => event => {

    let { error } = this.state;

    this.setState({
      error: checkMailingCampaignsFields(key, event.target.value, error)
    });
  }

  checkEditorInputIsValid = () => {

    let { error, editorState } = this.state;

    if (!editorState.getCurrentContent().hasText()) {
      error.message = 'This field is required';

    } else {

      delete error.message;
    }

    this.setState({ error });

    // Return true if NO error
    return error.message === undefined;
  }

  checkInputValue = () => {

    const { name, subject, email_control, error } = this.state;

    let newError = {},
      editorIsNotEmpty = this.checkEditorInputIsValid();

    newError = checkMailingCampaignsFields('name', name, error);

    checkMailingCampaignsFields('email_control', email_control, newError);

    checkMailingCampaignsFields('subject', subject, newError);

    this.setState({
      error: newError
    });

    if (Object.keys(newError).length === 0 && editorIsNotEmpty) {

      return true;
    }

    return false;
  }

  getCompaniesCount = () => {

    const {companies, loginObject } = this.props,
      adminPartnerName = 'Innoenergy';

    let isSuperAdmin = loginObject.userName === adminPartnerName;

    if (isSuperAdmin) {

      // In this case we only send the email to companies from
      // this very partner not the rest of the companies present
      // on this array but from other child partners

      let filteredCompanies = companies.filter(c => {

        return c.partner === adminPartnerName;
      });

      return filteredCompanies.length;

    } else {

      return companies.length;
    }
  }

  checkCampaignIsFromUser = (surveyOwner, userName) => {

    let nameIsMatching = false;

    if (surveyOwner && userName) {
      nameIsMatching = surveyOwner.includes(userName);
    }

    // Hardcoded for ERenovables and Andorra
    if ((surveyOwner === 'Energías Renovables' && userName === 'ERenovables') ||
      (surveyOwner === 'Andorra Renovables' && userName === 'Andorra')) {

      nameIsMatching = true;
    }

    return nameIsMatching;
  }

  checkCampaignYear = year => {

    const { surveys, loginObject } = this.props;

    let surveyAlreadyExist = false;

    surveys.forEach(survey => {
      if (survey.survey_of_year === year &&
        this.checkCampaignIsFromUser(survey.partner_name, loginObject.userName)) {

        // Current year survey already exisits
        surveyAlreadyExist = true;
      }
    });

    if (surveyAlreadyExist) {
      this.props.enqueueSnackbar('The survey for the current year already exists.', {variant: 'error'});
    }

    return surveyAlreadyExist;
  }

  toggleDialogVisibility = show => {

    const { surveyAlreadyExist } = this.state;

    if (surveyAlreadyExist && show) {

      this.props.enqueueSnackbar('The survey for the current year already exists.', {variant: 'error'});
      return;
    }

    this.setState({
      openDialog: show
    });
  }

  onSendConfirmed = () => {

    const { subject, email_control, survey_launch_id } = this.state;

    let companiesCount = this.getCompaniesCount();

    if (!this.checkInputValue()) {

      return;
    }

    this.setState({
      testSent: false
    });

    this.props.enqueueSnackbar(`Campaign created. Sending ${companiesCount} mails, this operation can take some time, please be patient.`, {variant: 'success'});

    this.props.sendReminder({
      is_reminder: false,
      all_havent_answered: true,
      all_havent_started: true,
      message_to_send: this.getDraftInHtmlFormat(),
      subject: subject,
      email_control: email_control,
      is_test: false,
      date_to_send: new Date().toISOString(),
      survey_launch: survey_launch_id,
    }, () => {

      this.setState({
        sent: true
      });

      this.props.fetchSurveys();

    });
  }

  onSendTest = () => {

    const { subject, name, year, email_control, testSent, survey_launch_id, surveyAlreadyExist } = this.state;

    if (surveyAlreadyExist) {

      this.props.enqueueSnackbar('The survey for the current year already exists.', {variant: 'error'});
      return;
    }

    let addNewCampaignCallback,
      objectToSend;

    if (!this.checkInputValue()) {

      return;
    }

    addNewCampaignCallback = survey_launch_id => {

      if (survey_launch_id) {

        this.props.sendReminder({
          is_reminder: false,
          all_havent_answered: true,
          all_havent_started: true,
          message_to_send: this.getDraftInHtmlFormat(),
          subject: subject,
          email_control: email_control,
          is_test: true,
          date_to_send: new Date().toISOString(),
          survey_launch: survey_launch_id,
        }, result => {

          if (result === 'success') {

            // Block the send button test only once this api call
            // was resolved successfully
            this.setState({
              testSent: true,
              survey_launch_id
            });

            this.props.enqueueSnackbar('Test email sent successfully!', {variant: 'success'});
          } else {
            this.props.enqueueSnackbar('There was an error sending the test email. Try again later.', {variant: 'error'});
          }

        });
      }

      this.props.fetchSurveys();
    };

    objectToSend = {
      campaign_name: name,
      survey_date_begins: new Date().toISOString(),
      survey_date_ends: null,
      survey_of_year: year,
      survey_id: 1,
    };

    if (testSent) {

      this.props.updateCampaign(survey_launch_id, objectToSend, addNewCampaignCallback);

    } else {
      this.props.createNewCampaign(objectToSend, addNewCampaignCallback);
    }
  }


  render() {

    const { name, year, subject, editorState, email_control, sent, error, testSent, openDialog } = this.state;

    const { classes } = this.props;

    if (sent) {
      return (
        <Grid container justify='center' className={classes.container}>
          <Grid item xs={11} md={8} lg={6}>
            <Grid container justify='center'>
              <Text color={Colors.white} fontSize={26} align='center'>Campaign sent</Text>
            </Grid>

            <Grid container>
              <FlexView justify='center' align='center'>
                <Icon className={classes.sentIcon}>near_me</Icon>
              </FlexView>
            </Grid>
          </Grid>
          <PopOverCloseIconView>
            <IconButton
              icon='close'
              color={Colors.white}
              backgroundColor='transparent'
              onPress={this.props.onClose}
              fontSize={26}
            />
          </PopOverCloseIconView>
        </Grid>
      )
    }

    return (
      <Grid container justify='center' className={classes.container}>
        <Grid item xs={11} md={8} lg={6}>
          <Grid container>
            <Text color={Colors.white} fontSize={26} style={{fontWeight: 500}}>New campaign for {year}</Text>
            <Text color={Colors.lightgray} fontSize={16}>This campaign will send automatically the survey to all companies in your Observatory.</Text>
            <Text color={Colors.lightgray} fontSize={16} padding='0 0 30px 0'>
                If you want to add new companies to the database, upload a file with the new registers in the Companies section before creating this campaign.
            </Text>
          </Grid>

          <Grid container>
            <Grid item xs={12} md={4}>
              <Text color={Colors.lightgray} fontSize={14}>CAMPAIGN NAME</Text>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomInput
                error={error.name}
                value={name}
                onBlur={this.checkThisInputIsValid('name')}
                onChange={this.handleInputChange('name')}
              />
            </Grid>
          </Grid>

          <GreenLine />
          <Grid container>
            <Grid item xs={12} md={4}>
              <Text color={Colors.lightgray} fontSize={14}>EMAIL SUBJECT</Text>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomInput
                error={error.subject}
                value={subject}
                placeholder="Email subject"
                onBlur={this.checkThisInputIsValid('subject')}
                onChange={this.handleInputChange('subject')}
              />
            </Grid>
          </Grid>

          <GreenLine />
          <Grid container>
            <Grid item xs={12} md={4}>
              <Text color={Colors.lightgray} fontSize={14}>MESSAGE FOR THE <br />CAMPAIGN EMAIL</Text>
            </Grid>
            <Grid item xs={12} md={8}>
              <Editor
                toolbar = {{
                  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign']
                }}
                editorState = {editorState}
                toolbarClassName = "editorToolbarStyles"
                editorClassName = "editorTextSpaceStyles"
                onEditorStateChange = {this.handleEditorChange}
              />
              <Text color={Colors.error} fontSize={12}>{error.message}</Text>
            </Grid>
          </Grid>

          <GreenLine />
          <Grid container>
            <Grid item xs={12} md={4}>
              <Text color={Colors.lightgray} fontSize={14}>EMAIL TO SEND THE TEST</Text>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomInput
                error={error.email_control}
                value={email_control}
                placeholder="Required e-mail to send a test"
                onBlur={this.checkThisInputIsValid('email_control')}
                onChange={this.handleInputChange('email_control')}
              />
            </Grid>
          </Grid>

          <GreenLine />
          <Grid container>
            <FlexView justify='flex-end'>
              <CustomButton
                buttonClass = "btn btn-white"
                text = "SEND TEST"
                style = {{marginRight: 10}}
                onPress = {this.onSendTest}
              />

              <CustomButton
                buttonClass = {`btn btn-white u-ml-15 ${!testSent ? classes.buttonDisabled : ''}`}
                text = "SEND CAMPAIGN"
                onPress = {() => {this.toggleDialogVisibility(true)}}
              />

              <AlertDialog
                blockButton = {!testSent}
                count = {this.getCompaniesCount()}
                open = {openDialog}
                onConfirm = {this.onSendConfirmed}
                onCancel = {() => {this.toggleDialogVisibility(false)}}
              />
            </FlexView>
          </Grid>
        </Grid>

        <PopOverCloseIconView>
          <IconButton
            icon='close'
            color={Colors.white}
            backgroundColor='transparent'
            onPress={this.props.onClose}
            fontSize={26}
          />
        </PopOverCloseIconView>
      </Grid>
    )
  }
}

NewCampaignModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  companies: state.dashboardReducer.companies,
  loginObject: state.dashboardReducer.loginObject,
  surveys: state.dashboardReducer.surveys
});

const mapDispatchToProps = ({
  createNewCampaign: dashboardActions.createNewCampaign,
  updateCampaign: dashboardActions.updateCampaign,
  sendReminder: dashboardActions.sendReminder,
  fetchSurveys: dashboardActions.fetchSurveys
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(NewCampaignModal)));
