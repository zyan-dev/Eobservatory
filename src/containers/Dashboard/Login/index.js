import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { dashboardActions } from '../../../redux/actions';
import { BlueLText } from '../../../styles/global';
import { CustomInput, CustomButton } from '../../../components';
import { RightView } from '../../../styles/dashboard';
import { Colors } from '../../../lib/theme';

const styles = {
  title: {
    marginTop: 100
  }
}

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: {},
      loading: false
    }
  }

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    this.checkInputValue(name, event.target.value);
  };

  onBlurInput = name => event => {

    this.checkInputValue(name, event.target.value);
  }

  checkInputValue = (name, value) => {

    let { error } = this.state;

    if (value.length === 0) {
      error[name] = 'This field is required';
    } else {
      delete error[name];
    }

    // key and value are named the same so we use this comptact notation
    this.setState({error});
  }

  onSubmit = () => {

    const { username, password, error } = this.state;

    if (Object.keys(error).length === 0) {

      this.setState({
        loading: true
      });

      this.props.loginDashboard({ username, password }, (res) => {
        this.setState({
          loading: false
        });

        if (res === 'success') {
          this.props.enqueueSnackbar('Welcome back!', {variant: 'success'})
          this.props.redirect();

        } else {
          this.props.enqueueSnackbar('Login Failed!', {variant: 'error'})
        }
      });
    }
  }


  render() {

    const { username, password, error, loading } = this.state;

    return (

      <div className="containerLandingPage loginContainer">
        <div className="bgImage">
        </div>

        <div className="sideContent">
          <Grid container justify="center">
            <Grid item xs={10} md={10}>
              <Grid container className={this.props.classes.title}>
                <BlueLText>Login</BlueLText>
              </Grid>

              <Grid container>
                <CustomInput
                  label={'USERNAME'}
                  value={username}
                  error={error.username}
                  onChange={this.handleInputChange('username')}
                  onBlur={this.onBlurInput('username')}
                />
              </Grid>

              <Grid container>
                <CustomInput
                  label={'PASSWORD'}
                  type={'password'}
                  value={password}
                  error={error.password}
                  onChange={this.handleInputChange('password')}
                  onBlur={this.onBlurInput('password')}
                />
              </Grid>

              <RightView>
                <CustomButton
                  buttonClass = "btn"
                  text={'Log In'}
                  backgroundColor={Colors.blue}
                  onPress={this.onSubmit}
                  loading={loading}
                />
              </RightView>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
});

const mapDispatchToProps = ({
  loginDashboard: dashboardActions.loginDashboard
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Login)));
