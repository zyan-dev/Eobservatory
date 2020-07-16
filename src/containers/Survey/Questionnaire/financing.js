import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Select from 'react-select';
import { Text, SpanText, Row, searchSelectStyle, fundTypeSelectStyle } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { QuestionInputWrapper } from '../../../styles/survey';
import { IconButton, NumberFormatCustom } from '../../../components';
import { surveyActions } from '../../../redux/actions';
import { FinancingPlanList } from '../../../lib/constants';
import { validateQuestion, generateOptionValue, generateOptions } from '../../../lib/operators';

const styles = theme => ({
  container: {
    padding: 30,
    [theme.breakpoints.down('sm')]: {
      padding: '10px'
    },
  },
  questionItemView: {
    marginTop: 5,
    marginBottom: 5,
    flex: 1,
  },
  questionWrapper: {
    width: '100%'
  }
})

class FinancingQuestion extends React.Component {

  handleInputChange = name => event => {
    this.props.updateFinancing({
      [name]: event.target.value
    });
  };

  handlePlanInputChange = () => option => {

    this.props.updateQuestion({
      hasPlanToRaiseFunds: option.label
    });

    if(option.label === 'Yes') {
      this.props.updateFinancing({havePlan: ''});

    } else if(option.label === 'No') {
      this.props.updateFinancing({havePlan: 'No'});

    } else {
      this.props.updateFinancing({havePlan: option.label});
    }
  }

  handleOperateInputChange = (name, index) => event => {

    let fundsList = this.props.financing.fundsList,
      value = '';

    if (name === 'amount') value = event.target.value;
    else if (name === 'country' || name === 'type') value = event;
    else value = event.label;

    fundsList[index] = {
      ...fundsList[index],
      [name]: value
    }

    this.props.updateFinancing({ fundsList });
  }

  addFund = () => {
    const { financing } = this.props;

    this.props.updateFinancing({
      fundsList: financing.fundsList.concat([{
        amount: '',
        type: '',
        country: {},
        year: ''
      }])
    });
  }

  removeFund = (index) => {
    const { financing } = this.props;
    let fundsList = financing.fundsList;
    fundsList.splice(index, 1)
    this.props.updateFinancing({
      fundsList,
    });
  }

  render() {
    const { classes, financing, questions, options } = this.props;
    return(
      <Grid container className={classes.container}>
        <Grid container justify="flex-end">
          <Text fontSize={26} color={Colors.blue} padding="10px">Financing</Text>
        </Grid>

        <Grid container>
          <QuestionInputWrapper className={classes.questionWrapper} validation={validateQuestion(questions, 'financing', 'fundsList')}>
            <Text color={Colors.gray} padding="0 0 20px 0">
              <span>
                <SpanText color={Colors.blue}>Q14&nbsp;&nbsp;</SpanText>
                |&nbsp; {`Has your company raised any external funds in ${questions.surveyYear - 1} (${questions.currency.value})`}?
              </span>
            </Text>
            {
              Array.apply(null, {length: financing.fundsList.length}).map((item, index) => {
                const fundData = financing.fundsList[index];

                return(
                  <Grid container key={index}>
                    <Row className={classes.questionItemView}>
                        <Grid container>
                          <Grid item xs={12} md={4}>
                            <Select
                              className="select"
                              value={fundData.type}
                              onChange={this.handleOperateInputChange('type', index)}
                              options={options.fundTypes}
                              placeholder="Type of funds raised"
                              styles={fundTypeSelectStyle}
                              isSearchable={false}
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Grid container>
                              <NumberFormatCustom
                                placeholder={questions.currency.value}
                                value={fundData.amount.toString()}
                                onChange={this.handleOperateInputChange('amount', index)}
                                isCount={false}
                                prefix={questions.currency.value}
                                isDisabled={fundData.type.value === 0}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Select
                              className="select"
                              value={fundData.country}
                              onChange={this.handleOperateInputChange('country', index)}
                              options={options.countryList}
                              placeholder="Country"
                              styles={searchSelectStyle}
                              isDisabled={fundData.type.value === 0}
                            />
                          </Grid>

                          {/*
                          <Grid item xs={4} md={2}>
                            <Select
                              value={generateOptionValue(fundData.year)}
                              onChange={this.handleOperateInputChange('year', index)}
                              options={generateOptions(getYearList(1960))}
                              placeholder="Year"
                              styles={searchSelectStyle}
                              isSearchable={false}
                            />
                          </Grid>
                          */}
                        </Grid>
                      <IconButton
                        icon="close"
                        size={20}
                        color={Colors.white}
                        backgroundColor={Colors.error}
                        onPress={() => this.removeFund(index)}
                        fontSize={14}
                        margin="0 10px 10px"
                        visible={financing.fundsList.length > 1 || index > 0}
                      />
                    </Row>
                  </Grid>
                )
              })
            }
            {
              validateQuestion(questions, 'financing', 'fundsList', false) &&
              <Row>
                <IconButton
                  icon="add"
                  size={24}
                  backgroundColor={Colors.gray}
                  color={Colors.lightgray}
                  onPress={() => this.addFund()}
                />
                <Text color={Colors.gray}>Add another country</Text>
              </Row>
            }
            <Text color={Colors.gray} padding="10px 0 20px 0">
              * Subsidy: Direct contributions, tax breaks and other special assistance that governments provide businesses to offset operating costs over a lengthy time period.<br />
              Grant: an amount of money given especially by the government to a person or organization for a special purpose.<br />
              Soft Loan: a loan with a low-interest rate. It is often made by multinational development banks (such as the Asian Development Fund), affiliates of the World Bank,
              or federal governments (or government agencies) to developing countries that would be unable to borrow at the market rate.
            </Text>
          </QuestionInputWrapper>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Grid container>
              <QuestionInputWrapper className={classes.questionWrapper} validation>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q15&nbsp;&nbsp;</SpanText>
                    |&nbsp; WHAT IS THE PERCENTAGE OF EQUITY CURRENTLY OWNED BY THE COFOUNDERS? (Optional)
                  </span>
                </Text>
                <Grid container>
                  <Row style={{width: '100%'}}>
                    <NumberFormatCustom
                      value={financing.percentage.toString()}
                      onChange={this.handleInputChange('percentage')}
                      isCount={false}
                      max={100}
                    />
                    <Text fontSize={20} color={Colors.blue} margin="0 0 0 10px">%</Text>
                  </Row>
                </Grid>
              </QuestionInputWrapper>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container>

              <Text className="sectionDividerText" fontSize={16} color={Colors.gray} padding="10px">Financing Forecast</Text>

              <QuestionInputWrapper className={classes.questionWrapper} validation={validateQuestion(questions, 'financing', 'havePlan')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q16&nbsp;&nbsp;</SpanText>
                    |&nbsp; {`DO YOU HAVE PLANS TO RAISE FUNDS DURING ${questions.surveyYear}?`}
                  </span>
                </Text>
                <Grid item xs={12}>
                  <Select
                    className="select"
                    value={generateOptionValue(questions.hasPlanToRaiseFunds)}
                    onChange={this.handlePlanInputChange('havePlan')}
                    options={generateOptions(FinancingPlanList)}
                    placeholder="Select"
                    styles={searchSelectStyle}
                    isSearchable={false}
                  />
                  <br />
                  {
                    questions.hasPlanToRaiseFunds === 'Yes' &&
                    <Row>
                      <Text fontSize={14} margin="0 10px 0 0">{`Estimated amount (${questions.currency.value}):`}</Text>
                      <br />
                      <NumberFormatCustom
                        placeholder={questions.currency.value}
                        value={financing.havePlan.toString()}
                        onChange={this.handleInputChange('havePlan')}
                        isCount={false}
                        prefix={questions.currency.value}
                      />
                    </Row>
                  }
                </Grid>
              </QuestionInputWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  financing: state.surveyReducer.financing,
  questions: state.surveyReducer,
  options: state.optionReducer
});

const mapDispatchToProps = ({
  updateFinancing: surveyActions.updateFinancing,
  updateQuestion: surveyActions.updateQuestion,
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FinancingQuestion));
