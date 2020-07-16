import * as React from 'react';
import { BlueLText, GrayMText } from '../../styles/global';
import { Container } from '../../styles/messagePage';

export default class SurveyEnd extends React.Component {

  render() {

    return (
      <Container style={{padding: '3rem'}}>
        <BlueLText>Thank you for participating in the E-Observatory!</BlueLText>
        <GrayMText style={{textAlign: 'center', padding: '0 6rem'}}>
          {'Once the campaign is closed you will receive the results to compare your venture with the aggregated data from the European start-up ecosystem.'}
        </GrayMText>
      </Container>
    );
  }
}
