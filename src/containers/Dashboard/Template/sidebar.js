import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { CenterRow, SBView } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { LeftSideWrapper } from '../../../styles/dashboard';
import { ResponseView, IconButton, Logo } from '../../../components';


const styles = ({
  button: {
    width: '100%',
    padding: 10,
    justifyContent: 'flex-start',
  },
  buttonText: {
    color: '#666666'
  },
  tabIcon: {
    width: 20,
    height: 20,
    color: '#666666'
  }
})

const partnerNames = ['CleanTech', 'ERenovables', 'GreenUnivers', 'Innoenergy'];

class DashboardSideview extends React.Component {

  onChangeIndex = (index, category) => {

    this.props.onChangeIndex(index, category);

    if (this.props.screenWidth < 640) {
      this.props.hideSideView();
    }
  }

  getPartnerName = () => {

    let { loginObject } = this.props;

    let logoName = 'Innoenergy';

    if (!loginObject.userName) {

      return logoName;
    }

    partnerNames.forEach(partnerName => {

      if (partnerName.includes(loginObject.userName)) {
        logoName = partnerName;
      }
    });

    return logoName;
  }

  render() {

    const { visible, index, classes, screenWidth, loginObject } = this.props;

    return(
      <LeftSideWrapper
        className="sideBar"
        screenWidth={screenWidth}
        style={{
          marginLeft: visible ? 0 : -240,
        }}
      >

        <SBView padding='0 0 10px 0'>
          <CenterRow style={{width: '100%'}}>
            <Logo className="logo" userName={this.getPartnerName()} />
          </CenterRow>

          <ResponseView type="mobile" toggleWidth={640}>
            <IconButton
              icon="keyboard_backspace"
              backgroundColor={Colors.blue}
              color={Colors.lightgray}
              onPress={() => this.props.hideSideView()}
              margin="0"
            />
          </ResponseView>
        </SBView>

        <Button
          className={classes.button}
          onClick={() => this.onChangeIndex(1, 'campaigns')}
        >
          <SBView style={{width: '100%'}} className={index === 1 ? 'isSelected' : ''}>
            <span className={classes.buttonText}>Campaigns</span>
            <Icon className={classes.tabIcon}>home</Icon>
          </SBView>
        </Button>

        <Button
          className={classes.button}
          onClick={() => this.onChangeIndex(3, 'companies')}
        >
          <SBView style={{width: '100%'}} className={index === 3 ? 'isSelected' : ''}>
            <span className={classes.buttonText}>Companies</span>
            <Icon className={classes.tabIcon}>search</Icon>
          </SBView>
        </Button>

        <Button
          className={classes.button}
          onClick={() => this.onChangeIndex(2, 'report')}
        >
          <SBView style={{width: '100%'}} className={index === 2 ? 'isSelected' : ''}>
            <span className={classes.buttonText}>Report</span>
            <Icon className={classes.tabIcon}>view_quilt</Icon>
          </SBView>
        </Button>

        {
          loginObject.userName === 'Innoenergy' &&
          <Button
            className={classes.button}
            onClick={() => this.onChangeIndex(4, 'report_comparison')}
          >
            <SBView style={{width: '100%'}} className={index === 4 ? 'isSelected' : ''}>
              <span className={classes.buttonText}>Report Comparison</span>
              <Icon className={classes.tabIcon}>view_quilt</Icon>
            </SBView>
          </Button>
        }

      </LeftSideWrapper>
    )
  }
}

DashboardSideview.propTypes = {
  visible: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
  hideSideView: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({

})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DashboardSideview));
