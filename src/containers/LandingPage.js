import React from 'react';
import Logo from '../components/Logo';

export default class LandingPage extends React.Component {

  redirectToSurvey = partnerName => event => {

    this.props.history.push({
      pathname: '/survey',
      state: { partnerName }
    });
  }

  render() {

    return (
      <div className="containerLandingPage">
        <div className="bgImage">
        </div>

        <div className="sideContent">

          <button className="btn btn-outline buttonPosition" onClick={() => this.props.history.push('/dashboard/login')}>Intranet sign in</button>

          <h1>
            {'Start-ups are revolutionising every sector. The InnoEnergy E-Observatory in Entrepreneurship is an initiative born from the idea of measuring the ' +
            'impact of energy start-ups in society and economy.'}
            <br />
            Join us!
          </h1>

          <p>Please select the country where your start-up is based:</p>

          <ul>
            <li>
              <p>France:</p>
              <div className="logoButtonContainer">
                <Logo userName="greenunivers" />
                <button className="btn" onClick={this.redirectToSurvey('greenunivers')}>Start now</button>
              </div>
            </li>
            <li>
              <p>Spain:</p>
              <div className="logoButtonContainer">
                <Logo userName="energiasrenovables" />
                <button className="btn" onClick={this.redirectToSurvey('energiasrenovables')}>Start now</button>
              </div>
            </li>
            <li>
              <p>Switzerland:</p>
              <div className="logoButtonContainer">
                <Logo userName="cleantechalps" />
                <button className="btn" onClick={this.redirectToSurvey('cleantechalps')}>Start now</button>
              </div>
            </li>
            <li>
              <p>All other countries:</p>
              <div className="logoButtonContainer">
                <Logo userName="innoenergy" className="imgBigger" />
                <button className="btn" onClick={this.redirectToSurvey('innoenergy')}>Start now</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );

  }
}
