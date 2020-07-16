import * as React from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

import SurveySidebar from "./sidebar";

import {
  MainContainer,
  MainQuestionInputContainer,
  MainQuestionTotalProgressView,
  MainQuestionContent,
  MainQuestionFooter,
} from "../../../styles/survey";

import { Colors } from "../../../lib/theme";
import {
  ProgressBar,
  IconButton,
  IfView,
  CustomButton,
} from "../../../components";
import {
  screenActions,
  surveyActions,
  optionActions,
} from "../../../redux/actions";
import { validateQuestion } from "../../../lib/operators";

import CompanyStatusQuestion from "./company_status";
import EconomicGrowthQuestion from "./economic_growth";
import FinancingQuestion from "./financing";
import IntellectualPropertyQuestion from "./intellectual_property";
import EnergyChallengeQuestion from "./energy_challenges";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  customButton: {
    position: "absolute",
    right: "0px",
  },
};

class Survey extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIndex: 1,
      loading: false,
    };
  }

  componentDidMount() {
    const hashKey = this.props.match.params.hash_key;

    const questionIndex = this.props.match.params.index;

    this.loadSelectOptions();

    let savedPartnerName = this.props.survey.partnerName;

    window.scrollTo(0, 0);

    this.props.resetSurvey({ hashKey });

    this.props.setPartnerName(savedPartnerName);

    let callback = (res) => {
      if (res === "No Active Survey Found") {
        // Survey closed, redirect to Invalid page
        // this.props.history.push('/survey_not_found');
      }
    };

    if (hashKey !== undefined) {
      setTimeout(() => {
        this.props.getInitialResponses(hashKey, (res) => {
          if (res === "error") {
            this.props.history.push("/survey_not_found");
          }
        });

        this.props.getMainResponses(hashKey, (res) => {
          if (res === "error") {
            this.props.history.push("/survey_not_found");
          } else {
            if (this.getAnsweredQuestions() === this.getTotalQuestionNumber()) {
              this.props.history.push({
                pathname: "/survey_not_found",
                state: {
                  message:
                    "This link is no longer available because the survey has already been completed. " +
                    "Thank you! Once the campaign is closed you will receive the results to compare with other start-ups.",
                  showButton: false,
                },
              });

              // this.props.enqueueSnackbar('Please be aware that this survey is already completed but you can update your answers anytime before it gets closed.', {variant: 'info'})
            }
          }
        });

        this.props.surveyVisit(hashKey, callback);
      }, 3000);
    } else {
      this.props.history.push("/survey_not_found");
    }

    this.setState({ questionIndex: Number(questionIndex) });
  }

  loadSelectOptions = () => {
    this.props.getBusinessTypes();
    this.props.getCurrencyList();
    this.props.getCountryList();
    this.props.getRegions();
    this.props.getStages();
    this.props.getSectorActivity();
    this.props.getFundTypes();
    this.props.getPatentCountryList();
    this.props.getPartnerShipTable();
  };

  onChangeIndex = (index) => {
    this.props.postMainResponses(this.state.questionIndex);

    this.setState({ questionIndex: index });

    this.props.history.push(
      "/survey/" + index + "/" + this.props.survey.hashKey
    );
  };

  getAnsweredQuestions = () => {
    let count = this.getProgress("company_status");

    count += this.getProgress("economic_growth");
    count += this.getProgress("financing");
    count += this.getProgress("intellectual_property");

    return count;
  };

  getTotalQuestionNumber = () => {
    return this.props.survey.total_required_question_count;
  };

  getProgress = (category) => {
    const { survey } = this.props;

    let completed_count = 0;

    Object.keys(survey[category]).forEach((key) => {
      if (category === "financing" && key === "percentage") {
        // This question is optional
        return true;
      }

      if (validateQuestion(survey, category, key, false)) {
        completed_count++;
      }
    });

    return completed_count;
  };

  onSubmit = () => {
    this.props.setSubmitted(true);

    setTimeout(() => {
      if (this.getAnsweredQuestions() !== this.getTotalQuestionNumber()) {
        this.props.enqueueSnackbar(
          `You didn't answered all the questions. Please check red-bordered question(s) and submit again or...` +
            ` come back later using the same link, the answered questions will remain the same!`,
          { variant: "error" }
        );
      } else {
        this.props.postInitialResponses(() => {});

        this.props.history.push("/survey_completed");
      }
    });

    this.props.postMainResponses(5);
  };

  onNextQuestion = (currentIndex) => {
    this.setState({ questionIndex: currentIndex + 1 });

    this.props.history.push(
      "/survey/" + (currentIndex + 1) + "/" + this.props.survey.hashKey
    );

    this.props.postMainResponses(currentIndex);
  };

  render() {
    const { questionIndex, loading } = this.state;
    const { screenWidth, visibleSideBar, classes } = this.props;

    const AnsweredQuestionsNumber = this.getAnsweredQuestions();

    const TotalQuestionsNumber = this.getTotalQuestionNumber();

    return (
      <MainContainer>
        <SurveySidebar
          visible={visibleSideBar}
          questionIndex={questionIndex}
          onChangeIndex={(index) => this.onChangeIndex(index)}
          hideSideView={() => this.props.setVisibleSideBar(false)}
        />

        <MainQuestionInputContainer screenWidth={screenWidth}>
          <MainQuestionTotalProgressView>
            <IfView condition={screenWidth < 640}>
              <IconButton
                icon="list"
                backgroundColor={Colors.blue}
                color={Colors.lightgray}
                onPress={() => this.props.setVisibleSideBar(!visibleSideBar)}
              />
              <div />
            </IfView>

            <ProgressBar
              label={`Total questions answered ${AnsweredQuestionsNumber} / ${TotalQuestionsNumber}`}
              percent={(AnsweredQuestionsNumber / TotalQuestionsNumber) * 100}
              barColor={Colors.green}
              width={screenWidth / 3}
              height={10}
              align={"flex-end"}
            />
          </MainQuestionTotalProgressView>

          <MainQuestionContent className="surveyContainer">
            {questionIndex === 1 && <CompanyStatusQuestion />}
            {questionIndex === 2 && <EconomicGrowthQuestion />}
            {questionIndex === 3 && <FinancingQuestion />}
            {questionIndex === 4 && <IntellectualPropertyQuestion />}
            {questionIndex === 5 && <EnergyChallengeQuestion />}
          </MainQuestionContent>

          <MainQuestionFooter className="surveyFooter">
            <IfView condition={questionIndex === 5}>
              <CustomButton
                buttonClass={`btn btn-white ${classes.customButton}`}
                text={"SUBMIT"}
                onPress={() => this.onSubmit()}
                loading={loading}
              />
              <CustomButton
                buttonClass={`btn btn-white ${classes.customButton}`}
                text={"NEXT"}
                onPress={() => this.onNextQuestion(questionIndex)}
                loading={loading}
              />
            </IfView>
          </MainQuestionFooter>
        </MainQuestionInputContainer>
      </MainContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  visibleSideBar: state.screenReducer.visibleSideBar,
  survey: state.surveyReducer,
});

const mapDispatchToProps = {
  setVisibleSideBar: screenActions.setVisibleSideBar,
  postMainResponses: surveyActions.postMainResponses,
  postInitialResponses: surveyActions.postInitialResponses,
  setSubmitted: surveyActions.setSubmitted,
  getInitialResponses: surveyActions.getInitialResponses,
  getMainResponses: surveyActions.getMainResponses,
  resetSurvey: surveyActions.resetSurvey,
  getBusinessTypes: optionActions.getBusinessTypes,
  getSectorActivity: optionActions.getSectorActivity,
  getCurrencyList: optionActions.getCurrencyList,
  getCountryList: optionActions.getCountryList,
  getRegions: optionActions.getRegions,
  getStages: optionActions.getStages,
  getFundTypes: optionActions.getFundTypes,
  getPatentCountryList: optionActions.getPatentCountryList,
  getPartnerShipTable: optionActions.getPartnerShipTable,
  surveyVisit: surveyActions.surveyVisit,
  setPartnerName: surveyActions.setPartnerName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(withStyles(styles)(Survey)));
