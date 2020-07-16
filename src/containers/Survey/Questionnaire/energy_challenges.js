import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Select from 'react-select';
import { Text, SpanText, searchSelectStyle } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { QuestionInputWrapper } from '../../../styles/survey';
import { surveyActions } from '../../../redux/actions';
import { generateOptionValue, generateOptions } from '../../../lib/operators';
import { EnergyChallengeAnswerList } from '../../../lib/constants';
import { CustomInput } from '../../../components';

const styles = theme => ({
  container: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: '10px'
    },
  },
})

class EnergyChallengeQuestion extends React.Component {

  handleOptionInputChange = name => option => {
    this.props.updateEnergyChallenges({
      [name]: option.label
    });
  };

  handleInputChange = name => event => {
    this.props.updateEnergyChallenges({
      [name]: event.target.value
    });
  }

  render() {
    const { classes, questions: { energy_challenges } } = this.props;
    return(
      <Grid container className={classes.container}>
        <Grid container justify="flex-end">
          <Text fontSize={26} color={Colors.blue} padding="10px">Energy Challenges (Optional)</Text>
        </Grid>
        <Grid container justify="flex-end">
          <Text fontSize={24} color={Colors.gray} align="right" padding="10px 10px 40px 0">
            How do you consider the impact of your company in the following topics (positive, negative or neutral)? Justify your answer.
          </Text>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} >
              <QuestionInputWrapper validation>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q19&nbsp;&nbsp;</SpanText>
                    |&nbsp; DOES YOUR COMPANY HAVE AN INFLUENCE IN DECREASING THE COST OF ENERGY? (Optional)
                  </span>
                </Text>
                <Select
                  className="select"
                  value={generateOptionValue(energy_challenges.decreaseCost)}
                  onChange={this.handleOptionInputChange('decreaseCost')}
                  options={generateOptions(EnergyChallengeAnswerList)}
                  placeholder="Select (Optional)"
                  styles={searchSelectStyle}
                  isSearchable={false}
                />
                <br />
                <CustomInput
                  value={energy_challenges.decreaseCost_description}
                  onChange={this.handleInputChange('decreaseCost_description')}
                  multiline={true}
                  rows={6}
                />
              </QuestionInputWrapper>
            </Grid>
            <Grid item xs={12} >
              <QuestionInputWrapper validation>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q20&nbsp;&nbsp;</SpanText>
                    |&nbsp; DOES YOUR COMPANY HAVE AN INFLUENCE IN INCREASING ENERGY AVAILABILITY AND SECURITY? (Optional)
                  </span>
                </Text>
                <Select
                  className="select"
                  value={generateOptionValue(energy_challenges.increaseEnergy)}
                  onChange={this.handleOptionInputChange('increaseEnergy')}
                  options={generateOptions(EnergyChallengeAnswerList)}
                  placeholder="Select (Optional)"
                  styles={searchSelectStyle}
                  isSearchable={false}
                />
                <br />
                <CustomInput
                  value={energy_challenges.increaseEnergy_description}
                  onChange={this.handleInputChange('increaseEnergy_description')}
                  multiline={true}
                  rows={6}
                />
              </QuestionInputWrapper>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} >
              <QuestionInputWrapper validation>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q21&nbsp;&nbsp;</SpanText>
                    |&nbsp; DOES YOUR COMPANY HAVE AN INFLUENCE IN DECREASING CO2 FOOTPRINT? (Optional)
                  </span>
                </Text>
                <Select
                  className="select"
                  value={generateOptionValue(energy_challenges.decreaseFootprint)}
                  onChange={this.handleOptionInputChange('decreaseFootprint')}
                  options={generateOptions(EnergyChallengeAnswerList)}
                  placeholder="Select (Optional)"
                  styles={searchSelectStyle}
                  isSearchable={false}
                />
                <br />
                <CustomInput
                  value={energy_challenges.decreaseFootprint_description}
                  onChange={this.handleInputChange('decreaseFootprint_description')}
                  multiline={true}
                  rows={6}
                />
              </QuestionInputWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  questions: state.surveyReducer,
});

const mapDispatchToProps = ({
  updateEnergyChallenges: surveyActions.updateEnergyChallenges,
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EnergyChallengeQuestion));
