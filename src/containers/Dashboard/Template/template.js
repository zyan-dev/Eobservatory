import * as React from 'react';
import { connect } from 'react-redux';

import { FlexView } from '../../../styles/global';
import { MainContainer, Content, RightView, TopBar } from '../../../styles/dashboard';
import { dashboardActions, screenActions } from '../../../redux/actions';
import { Colors } from '../../../lib/theme';
import { IconButton } from '../../../components';
import DashboardSideview from './sidebar';


class DashboardTemplate extends React.Component {

  onLogout = () => {

    this.props.logoutDashboard((wentOk) => {
      if (wentOk) {

        this.props.history.push(`/dashboard/login?redirect=campaigns`);
      }
    });
  }

  render() {

    const { index, visibleSideBar, screenWidth, loginObject } = this.props;

    return (
      <MainContainer>
        <DashboardSideview
          visible={visibleSideBar && index > 0}
          index={index}
          onChangeIndex={this.props.onChangeIndex}
          hideSideView={() => this.props.setVisibleSideBar(false)}
        />

        <RightView screenWidth={screenWidth} visibleSideBar={visibleSideBar && index > 0}>

          {index > 0 &&
            <TopBar className="topBar">
              <FlexView justify="flex-end" padding="10px 0">
                {loginObject.userName}
                <IconButton
                  icon="power_settings_new"
                  backgroundColor="transparent"
                  color={Colors.gray}
                  onPress={this.onLogout}
                  margin="10px"
                />
              </FlexView>
            </TopBar>
          }

          <Content>
            {this.props.children}
          </Content>

        </RightView>
      </MainContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  visibleSideBar: state.screenReducer.visibleSideBar,
  loginObject: state.dashboardReducer.loginObject
});

const mapDispatchToProps = ({
  setVisibleSideBar: screenActions.setVisibleSideBar,
  logoutDashboard: dashboardActions.logoutDashboard
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardTemplate);
