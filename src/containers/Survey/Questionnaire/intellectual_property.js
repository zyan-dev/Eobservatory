import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Select from 'react-select';
import { Text, SpanText, Row, searchSelectStyle } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { QuestionInputWrapper } from '../../../styles/survey';
import { IconButton, NumberFormatCustom } from '../../../components';
import { surveyActions } from '../../../redux/actions';
import { YesAndNo, YesNoDunno } from '../../../lib/constants';
import { getYearList, validateQuestion, generateOptions, generateOptionValue } from '../../../lib/operators';

const styles = theme => ({
  container: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: '10px'
    },
  },
  operateItemView: {
    marginTop: 5,
    marginBottom: 5,
  }
})

class IntellectualPropertyQuestion extends React.Component {

  handleInputChangePatentPlan = () => option => {

    // Q18

    // Yes: list of planned patents
    // No: 2
    // Dont know yet: 3

    if (option.label === 'Yes') {

      this.props.updateIntellectualProperty({
        planList: [{
          territory: '',
          count: 1
        }]
      });

    } else {

      this.props.updateIntellectualProperty({
        planList: option.label === 'No' ? 2 : 3
      });

    }

    this.props.updateQuestion({
      hasPlan: option.label
    });
  };

  handleInputChangePatentList = () => option => {

    // Q17

    // Yes: list of patents
    // No: 2

    if (option.label === 'Yes') {

      this.props.updateIntellectualProperty({
        patentList: [{
          country: '',
          year: '',
          count: 1
        }]
      });

    } else {

      this.props.updateIntellectualProperty({
        patentList: 2
      });

    }

    this.props.updateQuestion({
      hasPatent: option.label
    });
  }

  handleFormInputChange = (name, key, index) => event => {

    let temp = this.props.intellectual_property[key],
      value = '';

    if (name === 'count') {
      value = event.target.value;

    } else if (name === 'country' || name === 'territory') {
      value = event;

    } else {
      value = event.label;
    }

    temp[index] = {
      ...temp[index],
      [name]: value
    };

    this.props.updateIntellectualProperty({ [key]: temp });
  }

  addPatent = () => {

    const { intellectual_property } = this.props;

    this.props.updateIntellectualProperty({
      patentList: intellectual_property.patentList.concat([{
        country: {},
        year: '',
        count: 1
      }])
    });
  }

  removePatent = (index) => {
    let patentList = this.props.intellectual_property.patentList;

    patentList.splice(index, 1)

    this.props.updateIntellectualProperty({
      patentList,
    });
  }

  addPlan = () => {
    const { intellectual_property } = this.props;

    this.props.updateIntellectualProperty({
      planList: intellectual_property.planList.concat([{
        territory: {},
        count: 1
      }])
    });
  }

  removePlan = (index) => {
    let planList = this.props.intellectual_property.planList;

    planList.splice(index, 1)

    this.props.updateIntellectualProperty({
      planList,
    });
  }


  render() {

    const { classes, intellectual_property, questions, options } = this.props;

    return (
      <Grid container className={classes.container}>
        <Grid container justify="flex-end">
          <Text fontSize={26} color={Colors.blue} padding="10px">Intellectual Property</Text>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} >
              <QuestionInputWrapper validation={validateQuestion(questions, 'intellectual_property', 'patentList')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q17&nbsp;&nbsp;</SpanText>
                    |&nbsp; DO YOU HAVE ANY REGISTERED PATENTS?
                  </span>
                </Text>
                <Grid item xs={12} >
                  <Select
                    className="select"
                    value={generateOptionValue(questions.hasPatent)}
                    onChange={this.handleInputChangePatentList()}
                    options={generateOptions(YesAndNo)}
                    placeholder="Select"
                    styles={searchSelectStyle}
                    isSearchable={false}
                  />
                </Grid>
                {
                  questions.hasPatent === 'Yes' &&
                  Array.apply(null, {length: intellectual_property.patentList.length}).map((item, index) => {
                    const patentData = intellectual_property.patentList[index];
                    return(
                      <Row key={index} className={classes.operateItemView}>
                        <Grid container key={index}>
                          <Grid item xs={12} sm={6}>
                            <Select
                              className="select"
                              value={patentData.country}
                              onChange={this.handleFormInputChange('country', 'patentList', index)}
                              options={options.patentCountryList}
                              placeholder="Country"
                              styles={searchSelectStyle}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Select
                              className="select"
                              value={generateOptionValue(patentData.year)}
                              onChange={this.handleFormInputChange('year', 'patentList', index)}
                              options={generateOptions(getYearList(1960, questions.surveyYear))}
                              placeholder="Year"
                              styles={searchSelectStyle}
                              isSearchable={false}
                            />
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Grid container>
                              <NumberFormatCustom
                                value={patentData.count.toString()}
                                onChange={this.handleFormInputChange('count', 'patentList', index)}
                                min={1}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <IconButton
                          icon="close"
                          backgroundColor={Colors.error}
                          color={Colors.white}
                          onPress={() => this.removePatent(index)}
                          size={20}
                          fontSize={14}
                          margin="0 10px 10px"
                          visible={intellectual_property.patentList.length > 1 || index > 0}
                        />
                      </Row>
                    )
                  })
                }
                {
                  questions.hasPatent === 'Yes' && validateQuestion(questions, 'intellectual_property', 'patentList', false) &&
                  <Row>
                    <IconButton
                      icon="add"
                      size={20}
                      backgroundColor={Colors.grayIcons}
                      color={Colors.white}
                      onPress={() => this.addPatent()}
                    />
                    <Text color={Colors.gray}>Add another country</Text>
                  </Row>
                }
              </QuestionInputWrapper>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} >
              <Text fontSize={16} color={Colors.gray} padding="10px">Intellectual Property Forecast</Text>
              <QuestionInputWrapper validation={validateQuestion(questions, 'intellectual_property', 'planList')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q18&nbsp;&nbsp;</SpanText>
                    |&nbsp; DO YOU PLAN TO REGISTER PATENTS IN {questions.surveyYear}?
                  </span>
                </Text>
                <Grid item xs={12} >
                  <Select
                    className="select"
                    value={generateOptionValue(questions.hasPlan)}
                    onChange={this.handleInputChangePatentPlan()}
                    options={generateOptions(YesNoDunno)}
                    placeholder="Select"
                    styles={searchSelectStyle}
                    isSearchable={false}
                  />
                </Grid>
                {
                  questions.hasPlan === 'Yes' &&
                  Array.apply(null, {length: intellectual_property.planList.length}).map((item, index) => {
                    const planData = intellectual_property.planList[index];
                    return(
                      <Row key={index} className={classes.operateItemView}>
                        <Grid container key={index}>
                          <Grid item xs={8}>
                            <Select
                              className="select"
                              value={planData.territory}
                              onChange={this.handleFormInputChange('territory', 'planList', index)}
                              options={[{label: 'Europe', value: 'EU'}].concat(options.countryList)}
                              placeholder="Country"
                              styles={searchSelectStyle}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Grid container>
                              <NumberFormatCustom
                                value={(planData.count === undefined) ? '1' :planData.count.toString()}
                                onChange={this.handleFormInputChange('count', 'planList', index)}
                                min={1}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <IconButton
                          icon="close"
                          backgroundColor={Colors.error}
                          color={Colors.white}
                          onPress={() => this.removePlan(index)}
                          size={20}
                          fontSize={14}
                          margin="0 10px 10px"
                          visible={intellectual_property.planList.length > 1 || index > 0}
                        />
                      </Row>
                    )
                  })
                }
                {
                  questions.hasPlan === 'Yes' && validateQuestion(questions, 'intellectual_property', 'planList', false) &&
                  <Row>
                    <IconButton
                      icon="add"
                      size={20}
                      backgroundColor={Colors.grayIcons}
                      color={Colors.white}
                      onPress={() => this.addPlan()}
                    />
                    <Text color={Colors.gray}>Add another country</Text>
                  </Row>
                }
              </QuestionInputWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  intellectual_property: state.surveyReducer.intellectual_property,
  questions: state.surveyReducer,
  options: state.optionReducer
});

const mapDispatchToProps = ({
  updateIntellectualProperty: surveyActions.updateIntellectualProperty,
  updateQuestion: surveyActions.updateQuestion,
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IntellectualPropertyQuestion));
