import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid, FormControlLabel, Radio, RadioGroup, Icon } from '@material-ui/core';
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
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30
  },
  radio: {
    width: 8,
    height: 8,
    borderRadius: 24,
    border: '8px solid gray',
    backgroundColor: 'white'
  },
  rootRadio: {
    width: 24,
    height: 24,
    color: 'white'
  },
  label: {
    color: 'white',
    fontSize: '13px',
    margin: '10px 8px'
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

class SendReminderModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      type: '1',
      subject: '',
      email_control: '',
      openDialog: false,
      testSent: false,
      sent: false,
      error: {},
      editorState: EditorState.createEmpty(),
      number_all_havent_answered: 0,
      number_all_havent_started: 0
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

  getCompaniesCount = () => {

    const { number_all_havent_answered, number_all_havent_started, type } = this.state;

    if (type === '1') {
      return number_all_havent_started;
    }

    return number_all_havent_answered;
  }

  toggleDialogVisibility = show => {

    this.setState({
      openDialog: show
    });
  }

  onSend = isTest => {

    const { type, subject, email_control } = this.state;

    let companiesCount = this.getCompaniesCount();

    if (!this.checkInputValue()) {

      return;
    }

    let postObject = {
      is_reminder: true,
      all_havent_answered: type === '2',
      all_havent_started: type === '1',
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

      this.props.enqueueSnackbar(`Sending ${companiesCount} reminder mails, this operation can take some time, please be patient.`, {variant: 'success'});

      this.setState({
        testSent: false
      })
    }

    this.props.sendReminder(postObject, (result, response) => {

      this.setState({
        number_all_havent_answered: response.data.number_all_havent_answered,
        number_all_havent_started: response.data.number_all_havent_started
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

    const { editorState } = this.state;
    const { type, subject, email_control, sent, error, testSent, openDialog } = this.state;
    const { classes } = this.props;

    if (sent) {
      return (
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={11} md={8} lg={6}>
            <Grid container justify="center">
              <Text color={Colors.white} fontSize={26} align="center">Reminder sent</Text>
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
            <Text color={Colors.white} fontSize={26}>Campaign reminder</Text>
          </Grid>
          <Grid container>
            <Text color={Colors.lightgray} fontSize={14}>Select the users you want to send the reminder to:</Text>
          </Grid>

          <Grid container>
            <RadioGroup
              className={classes.radioGroup}
              value={type}
              onChange={this.handleInputChange('type')}
            >
              <FormControlLabel
                value={'1'}
                classes={{label: classes.label}}
                control={<Radio classes={{root: classes.rootRadio}} checkedIcon={<div className={classes.radio}/>} />}
                label="ALL COMPANIES THAT HAVEN'T ANSWERED THE SURVEY"
              />
              <FormControlLabel
                value={'2'}
                classes={{label: classes.label}}
                control={<Radio classes={{root: classes.rootRadio}} checkedIcon={<div className={classes.radio}/>} />}
                label="ALL COMPANIES THAT HAVE STARTED THE SURVEY BUT HAVEN'T FINISHED IT"
              />
            </RadioGroup>
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
            <FlexView justify="flex-end">
              <CustomButton
                buttonClass = "btn btn-white"
                text = "SEND TEST"
                style = {{marginRight: 10}}
                onPress = {() => {this.onSend(true)}}
              />

              <CustomButton
                buttonClass = {`btn btn-white u-ml-15 ${!testSent ? classes.buttonDisabled : ''}`}
                text = "SEND REMINDER"
                onPress = {() => {this.toggleDialogVisibility(true)}}
              />

              <AlertDialog
                blockButton = {!testSent}
                count = {this.getCompaniesCount()}
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
            color={Colors.white}
            backgroundColor="transparent"
            onPress={this.props.onClose}
            fontSize={26}
          />
        </PopOverCloseIconView>
      </Grid>
    )
  }
}

SendReminderModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  companies: state.dashboardReducer.companies,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  sendReminder: dashboardActions.sendReminder
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(SendReminderModal)));
