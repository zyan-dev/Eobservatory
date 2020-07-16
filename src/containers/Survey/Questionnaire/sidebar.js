import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { CenterRow, MText, SBView, searchSelectStyle } from '../../../styles/global';
import { Colors } from '../../../lib/theme';
import { LeftSideWrapper, CurrencyOptionView, CurrencyOptionInnerView } from '../../../styles/survey';
import { ProgressBar, ResponseView, IconButton, Logo } from '../../../components';
import { validateQuestion } from '../../../lib/operators';
import { surveyActions } from '../../../redux/actions';

const styles = ({
  button: {
    width: '100%',
    padding: 10,
    justifyContent: 'flex-start',
    color: '#666666'
  },
  selectedButton: {
    width: '100%',
    padding: 10,
    justifyContent: 'flex-start',
    color: Colors.blue,
    fontWeight: 500
  }
});

class SurveySidebar extends React.Component {

  getProgress = (what, category) => {
    const { questions } = this.props;
    let completed_count = 0;
    Object.keys(questions[category]).map((key) => {
      if(validateQuestion(questions, category, key, false)) completed_count++;

      return true;
    })
    if(what === 'text') return completed_count + '/' + Object.keys(questions[category]).length;
    else return completed_count / Object.keys(questions[category]).length * 100;
  }

  hideSideView = () => {
    this.props.hideSideView();
  }

  onChangeIndex = (index) => {
    this.props.onChangeIndex(index);
    if(this.props.screenWidth < 640) this.props.hideSideView();
  }

  changeCurrency = option => {
    this.props.changeCurrency(option);
  }

  render() {
    const { visible, questionIndex, questions, screenWidth, options, classes } = this.props;
    return(
      <LeftSideWrapper className="sideBar" screenWidth={screenWidth} style={{marginLeft: visible ? 0 : -300}}>
        <SBView>
          <CenterRow>
            <Logo className="logo" userName={questions.partnerName} />
          </CenterRow>
          <ResponseView type="mobile" toggleWidth={640}>
            <IconButton
              icon="keyboard_backspace"
              backgroundColor={Colors.blue}
              color={Colors.lightgray}
              onPress={() => this.hideSideView()}
              margin="0"
            />
          </ResponseView>
        </SBView>
        <MText>E-Observatory</MText>
        <hr color="#9ac740" />

        <Button
          className={questionIndex === 1 ? classes.selectedButton : classes.button}
          onClick={() => this.onChangeIndex(1)}
        >
          Company Status
        </Button>
        {
          questionIndex === 1 &&
          <ProgressBar
            label={this.getProgress('text', 'company_status')}
            percent={this.getProgress('percentage', 'company_status')}
            fullWidth
          />
        }
        <Button
          className={questionIndex === 2 ? classes.selectedButton : classes.button}
          onClick={() => this.onChangeIndex(2)}
        >
          Economic Growth {questions.surveyYear - 1}
        </Button>
        {
          questionIndex === 2 &&
          <ProgressBar
            label={this.getProgress('text', 'economic_growth')}
            percent={this.getProgress('percentage', 'economic_growth')}
            fullWidth
          />
        }
        <Button
          className={questionIndex === 3 ? classes.selectedButton : classes.button}
          onClick={() => this.onChangeIndex(3)}
        >
          Financing {questions.surveyYear - 1}
        </Button>
        {
          questionIndex === 3 &&
          <ProgressBar
            label={this.getProgress('text', 'financing')}
            percent={this.getProgress('percentage', 'financing')}
            fullWidth
          />
        }
        <Button
          className={questionIndex === 4 ? classes.selectedButton : classes.button}
          onClick={() => this.onChangeIndex(4)}
        >
          Intellectual Property {questions.surveyYear - 1}
        </Button>
        {
          questionIndex === 4 &&
          <ProgressBar
            label={this.getProgress('text', 'intellectual_property')}
            percent={this.getProgress('percentage', 'intellectual_property')}
            fullWidth
          />
        }
        <Button
          className={questionIndex === 5 ? classes.selectedButton : classes.button}
          onClick={() => this.onChangeIndex(5)}
        >
          Energy Challenges
        </Button>
        {
          questionIndex === 5 &&
          <ProgressBar
            label={this.getProgress('text', 'energy_challenges')}
            percent={this.getProgress('percentage', 'energy_challenges')}
            fullWidth
          />
        }
        <div className="inputContainer">
          <CurrencyOptionView>
            <CurrencyOptionInnerView>
              <Select
                className="select"
                value={questions.currency}
                onChange={this.changeCurrency}
                options={options.currencyList}
                styles={searchSelectStyle}
                isSearchable={false}
                menuPosition="fixed"
              />
            </CurrencyOptionInnerView>
          </CurrencyOptionView>
        </div>
      </LeftSideWrapper>
    )
  }
}

SurveySidebar.propTypes = {
  visible: PropTypes.bool.isRequired,
  questionIndex: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
  hideSideView: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  questions: state.surveyReducer,
  options: state.optionReducer
});

const mapDispatchToProps = ({
  changeCurrency: surveyActions.changeCurrency
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SurveySidebar));
