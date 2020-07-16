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

class SendResultsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subject: '',
      email_control: '',
      openDialog: false,
      testSent: false,
      sent: false,
      error: {},
      editorState: EditorState.createEmpty(),
      num_surveys_totally_completed: 0
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

    const { subject, error, email_control } = this.state;

    let newError = {},
      editorIsNotEmpty = this.checkEditorInputIsValid()

    newError = checkMailingCampaignsFields('email_control', email_control, error);

    checkMailingCampaignsFields('subject', subject, newError);

    this.setState({
      error: newError
    });

    if (Object.keys(newError).length === 0 && editorIsNotEmpty) {

      return true;
    }

    return false;
  }

  toggleDialogVisibility = show => {

    this.setState({
      openDialog: show
    });
  }

  onSend = isTest => {

    const { email_control, subject } = this.state;

    if (!this.checkInputValue()) {

      return;
    }

    let postObject = {
      subject,
      message_to_send: this.getDraftInHtmlFormat(),
      email_control,
      is_test: isTest,
      date_to_send: new Date().toISOString(),
      survey_launch: this.props.selectedSurveyId,
    };

    // Set to false here to block the send button and allow
    // only one click per "session"
    if (!isTest) {
      this.setState({
        testSent: false
      })
    }

    this.props.sendResults(postObject, (result, response) => {

      this.setState({
        num_surveys_totally_completed: response.data.num_surveys_totally_completed
      });

      if (!isTest) {
        this.setState({
          sent: true,
        });

      } else {

        if (result === 'success') {

          // Block the send button test only once this api call
          // was resolved successfully
          this.setState({
            testSent: true,
          });

          this.props.enqueueSnackbar('Test email sent successfully!', {variant: 'success'});

        } else {
          this.props.enqueueSnackbar('There was an error sending the test email. Try again later.', {variant: 'error'});
        }
      }

    });

  }


  render() {

    const { editorState, subject, num_surveys_totally_completed, email_control,
      sent, error, testSent, openDialog } = this.state;

    const { classes } = this.props;

    if (sent) {

      return (
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={11} md={8} lg={6}>
            <Grid container justify="center">
              <Text color={Colors.white} fontSize={26} align="center">Results sent</Text>
            </Grid>

            <Grid container>
              <FlexView justify="center" align="center">
                <Icon className={classes.sentIcon}>near_me</Icon>
              </FlexView>
            </Grid>
          </Grid>
          <PopOverCloseIconView>
            <IconButton
              icon="close"
              color={Colors.white}
              backgroundColor="transparent"
              onPress={this.props.onClose}
              fontSize={26}
            />
          </PopOverCloseIconView>
        </Grid>
      )
    }

    return (
      <Grid container justify="center" className={classes.container}>

        <Grid item xs={11} md={8} lg={6}>

          <Grid container>
            <Text color={Colors.white} fontSize={26}>Send campaign results to startups</Text>
          </Grid>
          <Grid container>
            <Text color={Colors.lightgray} fontSize={14}>
              With this action all companies that have completed the questionnaire of this campaign will receive an email with its granted access to the dashboard.
              There they can compare its results with the aggregated data from other companies within the Observatory.</Text>
          </Grid>

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
            <FlexView justify="flex-end">
              <CustomButton
                buttonClass = "btn btn-white"
                text = "SEND TEST"
                style = {{marginRight: 10}}
                onPress = {() => {this.onSend(true)}}
              />

              <CustomButton
                buttonClass = {`btn btn-white u-ml-15 ${!testSent ? classes.buttonDisabled : ''}`}
                text = "SEND RESULTS"
                onPress = {() => {this.toggleDialogVisibility(true)}}
              />

              <AlertDialog
                count = {num_surveys_totally_completed}
                open = {openDialog}
                onConfirm = {() => {this.onSend(false)}}
                onCancel = {() => {this.toggleDialogVisibility(false)}}
              />
            </FlexView>
          </Grid>
        </Grid>

        <PopOverCloseIconView>
          <IconButton
            icon="close"
            color={Colors.lightgray}
            backgroundColor="transparent"
            onPress={this.props.onClose}
            fontSize={26}
          />
        </PopOverCloseIconView>
      </Grid>
    )
  }
}

SendResultsModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  companies: state.dashboardReducer.companies,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  sendResults: dashboardActions.sendResults
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(SendResultsModal)));
