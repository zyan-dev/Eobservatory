import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import { SpanText, Text, RightView, Row, searchSelectStyle } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { surveyActions } from '../../../redux/actions';
import { QuestionInputWrapper } from '../../../styles/survey';
import { IconButton, NumberFormatCustom } from '../../../components';
import { YesAndNo } from '../../../lib/constants';
import { getYearList, validateQuestion, generateOptions, generateSectorOptions, generateOptionValue, generateSectorOptionValue } from '../../../lib/operators';

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
  },
  tableCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
})

class CompanyStatusQuestion extends React.Component {

  handleInputChange = name => event => {
    this.props.updateCompanyStatus({
      [name]: event.target.value
    });
  };

  handleOptionChange = name => option => {
    this.props.updateCompanyStatus({
      [name]: option
    });
  };

  handleOperateOptionInputChange = (name, index) => option => {
    let operateList = this.props.company_status.operateList;
    operateList[index] = {
      ...operateList[index],
      to: name === 'from' ? 'Still operating' : operateList[index].to,
      [name]: name === 'country' ? option : option.label,
    }
    this.props.updateCompanyStatus({ operateList });
  }

  handleSectorOptionInputChange = (name, index) => option => {

    let sectorList = this.props.company_status.sectorList;

    if (name === 'level1') {

      sectorList[index] = {
        level1: option,
        level2: {},
        level3: {}
      }

    } else if (name === 'level2') {

      sectorList[index] = {
        ...sectorList[index],
        level2: option,
        level3: {}
      }

    } else {

      sectorList[index] = {
        ...sectorList[index],
        level3: option,
      }
    }

    this.props.updateCompanyStatus({ sectorList });
  }

  handlePartnerShipInputChange = option => {
    if(option.label === 'No') {
      this.props.updateCompanyStatus({
        partnerShip: 'No'
      })
    } else {
      this.props.updateCompanyStatus({
        partnerShip: []
      })
    }
    this.props.updateQuestion({ partnerShip: option.label });
  }

  addOperate = () => {
    const { company_status } = this.props;
    this.props.updateCompanyStatus({
      operateList: company_status.operateList.concat([{
        country: {},
        from: '',
        to: 'Still operating'
      }])
    });
  }

  removeOperate = (index) => {
    let operateList = this.props.company_status.operateList;
    operateList.splice(index, 1)
    this.props.updateCompanyStatus({
      operateList,
    });
  }

  addSector = () => {
    const { company_status } = this.props;
    this.props.updateCompanyStatus({
      sectorList: company_status.sectorList.concat([{
        level1: {},
        level2: {},
        level3: {}
      }])
    });
  }

  removeSector = (index) => {
    let sectorList = this.props.company_status.sectorList;
    sectorList.splice(index, 1)
    this.props.updateCompanyStatus({
      sectorList,
    });
  }

  onChangeTableOption = (company, cooperation) => {
    let partnerShip = this.props.company_status.partnerShip;
    if(partnerShip[company.value] === cooperation) {
      let temp = {};
      Object.keys(partnerShip).map((key) => {
        if(String(key) !== String(company.value)) temp[key] = partnerShip[key];

        return true;
      })
      partnerShip = temp;
    } else {
      partnerShip = {
        ...partnerShip,
        [company.value]: cooperation
      }
    }
    this.props.updateCompanyStatus({
      partnerShip
    });
  }

  render() {
    const { classes, company_status, questions, options } = this.props;
    return(
      <Grid container className={classes.container}>
        <Grid container className="u-mb-medium" justify="flex-end">
          <Text fontSize={26} color={Colors.blue} padding="10px">Company Status</Text>
        </Grid>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Grid container>
              <Grid item xs={12} >
                <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'stage')}>
                  <Text color={Colors.gray} padding="0 0 20px 0">
                    <span>
                      <SpanText color={Colors.blue}>Q1&nbsp;&nbsp;</SpanText>
                      |&nbsp; IN YOUR OPTION IN WHICH STAGE THE COMPANY IS?
                    </span>
                  </Text>
                  <Select
                    className="select"
                    value={company_status.stage}
                    onChange={this.handleOptionChange('stage')}
                    options={options.stageList}
                    placeholder="Type of stage"
                    styles={searchSelectStyle}
                    isSearchable={false}
                  />
                </QuestionInputWrapper>
              </Grid>
              <Grid item xs={12} >
                <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'employeeCount')}>
                  <Text color={Colors.gray} padding="0 0 20px 0">
                    <span>
                      <SpanText color={Colors.blue}>Q2&nbsp;&nbsp;</SpanText>
                      |&nbsp; NUMBER OF EMPLOYEES (WITHOUT FOUNDERS)
                    </span>
                  </Text>
                  <Grid container>
                    <NumberFormatCustom
                      value={company_status.employeeCount.toString()}
                      onChange={this.handleInputChange('employeeCount')}
                    />
                  </Grid>
                </QuestionInputWrapper>
              </Grid>
              <Grid item xs={12} >
                <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'operateList')}>
                  <Text color={Colors.gray} padding="0 0 20px 0">
                    <span>
                      <SpanText color={Colors.blue}>Q3&nbsp;&nbsp;</SpanText>
                      |&nbsp; IN WHICH COUNTRIES DOES THE COMPANY OPERATE?
                    </span>
                  </Text>
                  {
                    Array.apply(null, {length: company_status.operateList.length}).map((item, index) => {
                      const operateData = company_status.operateList[index];

                      return(
                        <Row key={index} className={classes.operateItemView}>
                          <Grid container>
                            <Grid item xs={12} lg={6}>
                              <Select
                                className="select"
                                value={operateData.country}
                                onChange={this.handleOperateOptionInputChange('country', index)}
                                options={options.countryList}
                                placeholder="Country"
                                styles={searchSelectStyle}
                              />
                            </Grid>
                            <Grid item xs={6} lg={3}>
                              <Select
                                className="select"
                                value={generateOptionValue(operateData.from)}
                                onChange={this.handleOperateOptionInputChange('from', index)}
                                options={generateOptions(getYearList())}
                                styles={searchSelectStyle}
                                isSearchable={false}
                                placeholder="From"
                              />
                            </Grid>
                            <Grid item xs={6} lg={3}>
                              <Select
                                className="select"
                                value={generateOptionValue(operateData.to)}
                                onChange={this.handleOperateOptionInputChange('to', index)}
                                options={generateOptions(['Still operating'].concat(getYearList()))}
                                styles={searchSelectStyle}
                                isSearchable={false}
                                placeholder="To"
                              />
                            </Grid>
                          </Grid>
                          <IconButton
                            icon="close"
                            size={20}
                            backgroundColor={Colors.error}
                            color={Colors.white}
                            fontSize={14}
                            margin='0 10px 10px'
                            onPress={() => this.removeOperate(index)}
                            visible={company_status.operateList.length > 1 || index > 0}
                          />
                        </Row>
                      )
                    })
                  }
                  {
                    validateQuestion(questions, 'company_status', 'operateList', false) &&
                    <RightView>
                      <Text color={Colors.gray}>Add another country</Text>
                      <IconButton
                        icon="add"
                        size={20}
                        backgroundColor={Colors.grayIcons}
                        color={Colors.white}
                        onPress={() => this.addOperate()}
                      />
                    </RightView>
                  }
                </QuestionInputWrapper>

              </Grid>
              <Grid item xs={12} >
                <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'businessType')}>
                  <Text color={Colors.gray} padding="0 0 20px 0">
                    <span>
                      <SpanText color={Colors.blue}>Q4&nbsp;&nbsp;</SpanText>
                      |&nbsp; TYPE OF BUSINESS
                    </span>
                  </Text>
                  <Select
                    className="select"
                    value={company_status.businessType}
                    onChange={this.handleOptionChange('businessType')}
                    options={options.businessTypeList}
                    placeholder="Type of business"
                    styles={searchSelectStyle}
                    isSearchable={false}
                  />
                </QuestionInputWrapper>
              </Grid>
              <Grid item xs={12} >
                <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'sectorList')}>
                  <Text color={Colors.gray} padding="0 0 20px 0">
                    <span>
                      <SpanText color={Colors.blue}>Q5&nbsp;&nbsp;</SpanText>
                      |&nbsp; ACTIVITY SECTOR
                    </span>
                  </Text>
                  {
                    Array.apply(null, {length: company_status.sectorList.length}).map((item, index) => {

                      const sectorData = company_status.sectorList[index];

                      return (
                        <Row key={index} className={classes.operateItemView}>
                          <Grid container>
                            <Grid item xs={12} lg={4}>
                              <Select
                                className="select"
                                value = {generateSectorOptionValue(sectorData.level1)}
                                onChange = {this.handleSectorOptionInputChange('level1', index)}
                                options = {generateSectorOptions(options.sectorsList, sectorData, 1)}
                                styles = {searchSelectStyle}
                                isSearchable = {false}
                              />
                            </Grid>

                            <Grid item xs={12} lg={4}>
                              <Select
                                className="select"
                                value = {generateSectorOptionValue(sectorData.level2)}
                                onChange = {this.handleSectorOptionInputChange('level2', index)}
                                options = {generateSectorOptions(options.sectorsList, sectorData, 2)}
                                styles = {searchSelectStyle}
                                isSearchable = {false}
                              />
                            </Grid>

                            <Grid item xs={12} lg={4}>
                              <Select
                                className="select"
                                value = {generateSectorOptionValue(sectorData.level3)}
                                onChange = {this.handleSectorOptionInputChange('level3', index)}
                                options = {generateSectorOptions(options.sectorsList, sectorData, 3)}
                                styles = {searchSelectStyle}
                                isSearchable = {false}
                              />
                            </Grid>
                          </Grid>

                          <IconButton
                            icon="close"
                            size={20}
                            backgroundColor={Colors.error}
                            color={Colors.white}
                            fontSize={14}
                            onPress={() => this.removeSector(index)}
                            visible={company_status.sectorList.length > 1 || index > 0}
                          />
                        </Row>
                      )
                    })
                  }
                  <RightView>
                    <Text color={Colors.gray}>Add another sector</Text>
                    <IconButton
                      icon="add"
                      size={20}
                      backgroundColor={Colors.grayIcons}
                      color={Colors.white}
                      onPress={() => this.addSector()}
                    />
                  </RightView>
                </QuestionInputWrapper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid item xs={12} >

              <Text className="sectionDividerText" fontSize={16} color={Colors.gray} padding="10px">Job Creation {questions.surveyYear - 1}</Text>

              <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'JobCount2018')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q6&nbsp;&nbsp;</SpanText>
                    |&nbsp; HOW MANY DIRECT JOBS HAVE YOU CREATED IN {questions.surveyYear - 1}?
                  </span>
                </Text>
                <Grid container>
                  <NumberFormatCustom
                    value={company_status.JobCount2018.toString()}
                    onChange={this.handleInputChange('JobCount2018')}
                  />
                </Grid>
              </QuestionInputWrapper>
            </Grid>
            <Grid item xs={12} >
              <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'fullTimeJobCount2018')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q7&nbsp;&nbsp;</SpanText>
                    |&nbsp; HOW MANY OF THOSE ARE FULL_TIME EMPLOYEES?
                  </span>
                </Text>
                <Grid container>
                  <NumberFormatCustom
                    value={company_status.fullTimeJobCount2018.toString()}
                    onChange={this.handleInputChange('fullTimeJobCount2018')}
                    max={Number(company_status.JobCount2018)}
                  />
                </Grid>
              </QuestionInputWrapper>
            </Grid>
            <Grid item xs={12} >

              <Text className="sectionDividerText" fontSize={16} color={Colors.gray} padding="10px">Job Creation Forecast</Text>

              <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'JobCount2019')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q8&nbsp;&nbsp;</SpanText>
                    |&nbsp; HOW DIRECT JOBS ARE YOU PLANNING TO CREATE IN {questions.surveyYear}?
                  </span>
                </Text>
                <Grid container>
                  <NumberFormatCustom
                    value={company_status.JobCount2019.toString()}
                    onChange={this.handleInputChange('JobCount2019')}
                  />
                </Grid>
              </QuestionInputWrapper>
            </Grid>
            <Grid item xs={12} >
              <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'fullTimeJobCount2019')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q9&nbsp;&nbsp;</SpanText>
                    |&nbsp; HOW MANY DO YOU FORESEE AS FULL TIME EMPLOYEE?
                  </span>
                </Text>
                <Grid container>
                  <NumberFormatCustom
                    value={company_status.fullTimeJobCount2019.toString()}
                    onChange={this.handleInputChange('fullTimeJobCount2019')}
                    max={Number(company_status.JobCount2019)}
                  />
                </Grid>
              </QuestionInputWrapper>
            </Grid>
            <Grid item xs={12} >
              <QuestionInputWrapper validation={validateQuestion(questions, 'company_status', 'partnerShip')}>
                <Text color={Colors.gray} padding="0 0 20px 0">
                  <span>
                    <SpanText color={Colors.blue}>Q10&nbsp;&nbsp;</SpanText>
                    |&nbsp; HAVE YOU ESTABLISHED ANY PARTNERSHIPS?
                  </span>
                </Text>
                <Select
                  className="select"
                  value={generateOptionValue(questions.partnerShip)}
                  onChange={this.handlePartnerShipInputChange}
                  options={generateOptions(YesAndNo)}
                  styles={searchSelectStyle}
                  isSearchable={false}
                  placeholder="Select"
                />
                {
                  questions.partnerShip === 'Yes' &&
                  <Grid container>
                    <Grid container>
                      <Grid item xs={4} />
                      <Grid item xs={2} className={classes.tableCell}>
                        <Text color={Colors.gray} align="center">Large Enterprise</Text>
                      </Grid>
                      <Grid item xs={2} className={classes.tableCell}>
                        <Text color={Colors.gray} align="center">Medium-sized</Text>
                      </Grid>
                      <Grid item xs={2} className={classes.tableCell}>
                        <Text color={Colors.gray} align="center">Small</Text>
                      </Grid>
                      <Grid item xs={2} className={classes.tableCell}>
                        <Text color={Colors.gray} align="center">Micro</Text>
                      </Grid>
                    </Grid>
                    {
                      options.partnerShipList !== undefined &&
                      options.partnerShipList.map((item, index) => {
                        return(
                          <Grid container key={index}>
                            <Grid item xs={4}>
                              <Text color={Colors.gray}>{item.label}</Text>
                            </Grid>
                            <Grid item xs={2} className={classes.tableCell}>
                              <input type="checkbox" checked={company_status.partnerShip[item.value] === 'Large Enterprise'} onChange={() => this.onChangeTableOption(item, 'Large Enterprise')}/>
                            </Grid>
                            <Grid item xs={2} className={classes.tableCell}>
                              <input type="checkbox" checked={company_status.partnerShip[item.value] === 'Medium-sized'} onChange={() => this.onChangeTableOption(item, 'Medium-sized')}/>
                            </Grid>
                            <Grid item xs={2} className={classes.tableCell}>
                              <input type="checkbox" checked={company_status.partnerShip[item.value] === 'Small'} onChange={() => this.onChangeTableOption(item, 'Small')}/>
                            </Grid>
                            <Grid item xs={2} className={classes.tableCell}>
                              <input type="checkbox" checked={company_status.partnerShip[item.value] === 'Micro'} onChange={() => this.onChangeTableOption(item, 'Micro')}/>
                            </Grid>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
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
  company_status: state.surveyReducer.company_status,
  questions: state.surveyReducer,
  options: state.optionReducer
});

const mapDispatchToProps = ({
  updateCompanyStatus: surveyActions.updateCompanyStatus,
  updateQuestion: surveyActions.updateQuestion,
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CompanyStatusQuestion));
