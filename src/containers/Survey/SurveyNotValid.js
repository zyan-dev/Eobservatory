import * as React from 'react';
import { GrayMText, BlueLText } from '../../styles/global';
import { Container } from '../../styles/messagePage';

export default class SurveyNotValid extends React.Component {

  render() {

    const styles = {
      container: {
        padding: '3rem'
      },
      grayText: {
        textAlign: 'center',
        padding: '0 3rem'
      },
      button: {
        backgroundColor: '#0F387E',
        color: 'white',
        padding: '10px 22px',
        textAlign: 'center',
        border: 0,
        borderRadius: '6px',
        fontSize: '14px',
        textTransform: 'uppercase',
        marginTop: '15px',
        cursor: 'pointer'
      }
    }

    let message = 'Oh, Oh! This campaign is already closed. Do not miss next E-Observatory campaign!',
      showButton = true;

    try {
      message = this.props.location.state.message;
    } catch (e) {
      console.log(e.toString());
    }

    try {
      showButton = this.props.location.state.showButton;

    } catch (e) {
      console.log(e.toString());
    }

    return (
      <Container style={styles.container}>
        <BlueLText>{message}</BlueLText>
        {
          showButton &&
          <GrayMText style={styles.grayText}>
            Please click the button below to start a new survey without a given active link.<br />
            <button style={styles.button} onClick={() => this.props.history.push('/survey')}>here</button>
          </GrayMText>
        }
      </Container>
    );
  }
}
