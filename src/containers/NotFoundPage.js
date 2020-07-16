import * as React from 'react';
import { GrayMText, BlueLText } from '../styles/global';
import { Container } from '../styles/messagePage';

export default class NotFoundPage extends React.Component {

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

    return (
      <Container style={styles.container}>
        <BlueLText>{`This page doesn't exist`}</BlueLText>

        <GrayMText style={styles.grayText}>
          Please click the button below to return.<br />
          <button style={styles.button} onClick={() => this.props.history.goBack()}>here</button>
        </GrayMText>
      </Container>
    );
  }
}
