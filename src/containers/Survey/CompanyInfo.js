import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

import { withStyles } from "@material-ui/core/styles";
import { Grid, Radio, FormControlLabel, Checkbox } from "@material-ui/core";
import Select from "react-select";
import { Colors } from "../../lib/theme";
import { Wrapper, SideImage, SideOverLap } from "../../styles/survey";
import {
  Row,
  WhiteLText,
  WhiteSText,
  PV,
  Text,
  BottomView,
  searchSelectStyle,
  GraySText,
  MText,
  ErrorText,
} from "../../styles/global";

import {
  CustomInput,
  ResponseView,
  NumberFormatCustom,
  Logo,
} from "../../components";
import CustomButton from "../../components/CustomButton";
import { surveyActions, optionActions } from "../../redux/actions";
import { ImageSolarPlant } from "../../assets/images";
import {
  getYearList,
  generateOptionValue,
  generateOptions,
  validateEmail,
  validateURL,
} from "../../lib/operators";

const styles = {
  container: {
    minHeight: "100vh",
  },
  wrapper: {
    backgroundColor: Colors.white,
    padding: "40px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
};

const thisFieldIsRequired = "This field is required";

class CompanyInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: {},
      checkedValidation: false,
      partnerName: "",
      notificationsChecked: false,
      privacyPolicyChecked: false,
    };
  }

  componentDidMount() {
    const hashKey = this.props.match.params.hash_key;

    this.props.resetSurvey({ hashKey });

    this.loadSelectOptions();

    // this.handlePartnerName();

    // if (hashKey !== undefined) {

    //   setTimeout(() => {
    //     this.props.getInitialResponses(hashKey, res => {

    //       if (res === 'error') {
    //         this.props.history.push('/survey_not_found');

    //       } else if (res === 'success_not_empty') {

    //         // this.setState({
    //         //   notificationsChecked: true,
    //         //   privacyPolicyChecked: true
    //         // })
    //       }

    //     });
    //   }, 2000);
    // }
  }

  handlePartnerName = () => {
    let partnerNameAlreadySet = "";

    try {
      partnerNameAlreadySet = this.props.location.state.partnerName;
    } catch (e) {
      // console.log(e.toString());
    }

    if (partnerNameAlreadySet) {
      this.setState({ partnerName: partnerNameAlreadySet });

      this.props.setPartnerName(partnerNameAlreadySet);
    } else {
      setTimeout(() => {
        let urlParam = window.location.href.split("="),
          partnerName = "";

        if (urlParam.length > 1) {
          urlParam = urlParam[urlParam.length - 1];

          if (urlParam) {
            partnerName = urlParam.replace("#/", "").replace("/", "");

            this.setState({ partnerName });

            this.props.setPartnerName(partnerName);
          }
        }

        return "";
      }, 300);
    }
  };

  loadSelectOptions = () => {
    this.props.getBusinessTypes();
    this.props.getCurrencyList();
    this.props.getCountryList();
    this.props.getRegions();
    this.props.getStages();
  };

  handleInputChange = (name) => (event) => {
    this.props.updateQuestion({
      initial: {
        ...this.props.survey.initial,
        [name]: event.target.value,
      },
    });
  };

  handleSelectInputChange = (name) => (option) => {
    this.props.updateQuestion({
      initial: {
        ...this.props.survey.initial,
        [name]: option.label,
      },
    });
  };

  handleCheckboxes = (key) => (event) => {
    let stateObj = {};

    stateObj[key] = event.target.checked;

    this.setState(stateObj);
  };

  onChangeCheckOption = (value) => {
    this.props.updateQuestion({
      initial: {
        ...this.props.survey.initial,
        incubation: value ? "Yes" : "No",
      },
    });

    this.checkInputValidation(true);
  };

  handleCountryAndRegionInputChange = (name) => (option) => {
    let replace = {};

    if (name === "country") {
      replace = {
        region: {},
      };
    }

    this.props.updateQuestion({
      initial: {
        ...this.props.survey.initial,
        [name]: option,
        ...replace,
      },
    });

    setTimeout(() => {
      this.checkInputValidation(true);
    });
  };

  getCountryRegions = (country) => {
    let result = [];

    result = this.props.options.regionList.filter((region) => {
      return country.value === region.item;
    });

    return result;
  };

  onBlurInput = () => {
    this.checkInputValidation(true);
  };

  onPressNext = () => {
    const { privacyPolicyChecked, notificationsChecked } = this.state;

    if (!this.checkInputValidation(false)) {
      this.setState({
        checkedValidation: true,
      });

      return;
    }

    if (!privacyPolicyChecked || !notificationsChecked) {
      this.props.enqueueSnackbar(
        "Please review notifications and Privacy Policy checkboxes before taking the survey.",
        { variant: "error", autoHideDuration: 8000 }
      );

      return;
    }

    this.props.postInitialResponses((payload, isError) => {
      let callback = (res) => {
        if (res === "No Active Survey Found") {
          // Survey closed, redirect to Invalid page
          // this.props.history.push('/survey_not_found');
          this.props.history.push("/survey/1/" + payload);
        } else {
          this.props.setSurveyYear(res);

          this.props.history.push("/survey/1/" + payload);
        }
      };

      if (isError) {
        // Payload is the error message here
        // We do not redirect, just stay in this page and
        // show a notistack with the error message
        this.props.enqueueSnackbar(payload, {
          variant: "error",
          autoHideDuration: 8000,
        });
      } else {
        // Payload is the hashcode in this case
        this.props.surveyVisit(payload, callback);
      }
    });
  };

  isEmptyValidation = (attr) => {
    if (attr === null) {
      return thisFieldIsRequired;
    }

    if (typeof attr === "object" && Object.keys(attr).length) {
      return thisFieldIsRequired;
    }

    if (attr.length === 0) {
      return thisFieldIsRequired;
    }

    return "";
  };

  validateCountryAndRegion = (country, region, error) => {
    if (!country || (country && Object.keys(country).length === 0)) {
      error.country = thisFieldIsRequired;

      return;
    }

    if (this.getCountryRegions(country).length > 0) {
      // This country has regions so it's mandatory to choose one
      if (!region || (region && Object.keys(region).length === 0)) {
        error.region = thisFieldIsRequired;
      }
    }
  };

  checkInputValidation = (check) => {
    if (check && !this.state.checkedValidation) {
      return;
    }

    let error = {};

    const {
      company,
      activity,
      country,
      region,
      incubation,
      website,
      name,
      surname,
      position,
      email,
    } = this.props.survey.initial;

    this.setState({
      error: {},
    });

    // All this values have the same validation function
    // key is the literal and value the value itself
    [
      { company },
      { activity },
      { incubation },
      { website },
      { name },
      { surname },
      { position },
      { email },
    ].forEach((attr) => {
      let errorMsg = this.isEmptyValidation(Object.values(attr)[0]);

      if (errorMsg) {
        // literal is needed here
        error[Object.keys(attr)[0]] = errorMsg;
      }
    });

    // Custom validations
    this.validateCountryAndRegion(country, region, error);

    if (!validateURL(website)) {
      error.website = "Enter a valid URL";
    }

    if (!validateEmail(email)) {
      error.email = "Please enter a valid email";
    }

    this.setState({ error });

    return Object.keys(error).length === 0;
  };

  render() {
    const {
      error,
      partnerName,
      notificationsChecked,
      privacyPolicyChecked,
    } = this.state;

    const {
      company,
      country,
      region,
      activity,
      incubation,
      website,
      numberOfCoFounder,
      incorporatedYear,
      name,
      surname,
      position,
      email,
      loading,
    } = this.props.survey.initial;

    const { classes, screenWidth, options } = this.props;

    return (
      <div>
        <Grid container className={classes.container}>
          <ResponseView type="mobile" toggleWidth={960}>
            <SideImage
              src={ImageSolarPlant}
              style={{ height: 300, width: "100%", position: "relative" }}
            >
              <SideOverLap />
              <PV padding={30} style={{ zIndex: 10 }}>
                <WhiteLText>Welcome to E-Observatory</WhiteLText>
                <WhiteSText>
                  After a few questions, you will find out in what way you are
                  contributing to the sustainable energy ecosystem.
                </WhiteSText>
                <WhiteSText>
                  Your personal data will remain confidential, it will only be
                  used for statistical purposes.
                </WhiteSText>
              </PV>
            </SideImage>
          </ResponseView>

          <Grid
            item
            xs={12}
            md={8}
            className={classes.wrapper}
            style={{ borderWidth: screenWidth < 640 ? 0 : 0 }}
          >
            <Wrapper>
              <Row>
                <Logo userName={partnerName} />
              </Row>

              <Text
                fontFamily={"Roboto"}
                color={Colors.gray}
                fontSize={22}
                padding="30px 0 20px 0"
                style={{ fontWeight: 300 }}
              >
                Tell us more about your start-up...
              </Text>

              <Grid container justify="space-between">
                <Grid item xs={12} md={6}>
                  <CustomInput
                    error={error.company}
                    label={"COMPANY NAME"}
                    value={company || ""}
                    onChange={this.handleInputChange("company")}
                    onBlur={this.onBlurInput}
                  />
                  <CustomInput
                    error={error.activity}
                    label={"ACTIVITY"}
                    value={activity || ""}
                    onChange={this.handleInputChange("activity")}
                    multiline={true}
                    rows={6}
                    onBlur={this.onBlurInput}
                  />

                  <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                      <div className="inputContainer">
                        <GraySText className="label">
                          NUMBER OF CO_FOUNDERS
                        </GraySText>
                        <Grid container>
                          <NumberFormatCustom
                            value={numberOfCoFounder}
                            onChange={this.handleInputChange(
                              "numberOfCoFounder"
                            )}
                          />
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div className="inputContainer">
                        <GraySText className="label">
                          YEAR INCORPORATED
                        </GraySText>
                        <Select
                          className="select"
                          value={generateOptionValue(incorporatedYear)}
                          onChange={this.handleSelectInputChange(
                            "incorporatedYear"
                          )}
                          options={generateOptions(getYearList(2000))}
                          styles={searchSelectStyle}
                          isSearchable={false}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} lg={6}>
                      <div className="inputContainer">
                        <GraySText className="label">COUNTRY</GraySText>
                        <Select
                          className="select"
                          value={country}
                          onChange={this.handleCountryAndRegionInputChange(
                            "country"
                          )}
                          options={options.countryList}
                          styles={searchSelectStyle}
                        />
                        {error.country && (
                          <ErrorText className="error">
                            {error.country}
                          </ErrorText>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <div className="inputContainer">
                        <GraySText className="label">REGION</GraySText>
                        <Select
                          className="select"
                          value={region}
                          onChange={this.handleCountryAndRegionInputChange(
                            "region"
                          )}
                          options={this.getCountryRegions(country)}
                          styles={searchSelectStyle}
                          isDisabled={
                            this.getCountryRegions(country).length === 0
                          }
                        />
                        {error.region && (
                          <ErrorText className="error">
                            {error.region}
                          </ErrorText>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container className="radioButtonContainer">
                    <GraySText style={{ width: "100%" }}>
                      HAVE YOU BEEN IN AN INCUBATION PROGRAM?
                    </GraySText>
                    <Grid item xs={4}>
                      <MText>
                        Yes
                        <Radio
                          checked={incubation === "Yes"}
                          onChange={() => this.onChangeCheckOption(1)}
                          value="1"
                          color="default"
                          name="radio-button-incubation"
                          aria-label="Yes"
                        />
                      </MText>
                    </Grid>
                    <Grid item xs={4}>
                      <MText>
                        No
                        <Radio
                          checked={incubation === "No"}
                          onChange={() => this.onChangeCheckOption(0)}
                          value="0"
                          color="default"
                          name="radio-button-incubation"
                          aria-label="No"
                        />
                      </MText>
                    </Grid>
                    {error.incubation && (
                      <ErrorText className="error">
                        This field is required
                      </ErrorText>
                    )}
                  </Grid>
                  <CustomInput
                    error={error.website}
                    label={"WEBSITE"}
                    value={website || ""}
                    onChange={this.handleInputChange("website")}
                    onBlur={this.onBlurInput}
                  />
                </Grid>
              </Grid>

              <Text
                color={Colors.gray}
                fontSize={22}
                padding="50px 0 20px 0"
                style={{ fontWeight: 300 }}
              >
                And about you...
              </Text>
              <Grid container justify="space-between">
                <Grid item xs={12} md={6}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                      <CustomInput
                        label={"NAME"}
                        value={name || ""}
                        error={error.name}
                        onChange={this.handleInputChange("name")}
                        onBlur={this.onBlurInput}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomInput
                        label={"SURNAME"}
                        value={surname || ""}
                        error={error.surname}
                        onChange={this.handleInputChange("surname")}
                        onBlur={this.onBlurInput}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <CustomInput
                        label={"EMAIL"}
                        value={email || ""}
                        error={error.email}
                        onChange={this.handleInputChange("email")}
                        flex={3}
                        onBlur={this.onBlurInput}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                  <CustomInput
                    label={"POSITION"}
                    value={position || ""}
                    error={error.position}
                    onChange={this.handleInputChange("position")}
                    onBlur={this.onBlurInput}
                  />
                </Grid>
              </Grid>

              <BottomView>
                <Grid
                  item
                  style={{ display: "flex", flexWrap: "wrap" }}
                  xs={12}
                  md={8}
                >
                  <FormControlLabel
                    style={{ width: "100%" }}
                    control={
                      <Checkbox
                        color="default"
                        checked={notificationsChecked}
                        onChange={this.handleCheckboxes("notificationsChecked")}
                      />
                    }
                    label="I agree to receive information and notifications about E-Observatory and other notifications from KIC InnoEnergy S.E."
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        color="default"
                        checked={privacyPolicyChecked}
                        onChange={this.handleCheckboxes("privacyPolicyChecked")}
                      />
                    }
                    label="I have read and accept the "
                  />
                  <Link
                    className="linkToPolicy"
                    to="/privacy_policy"
                    target="_blank"
                  >
                    Privacy Policy and Cookies
                  </Link>
                </Grid>

                <CustomButton
                  text={"SAVE CHANGES"}
                  backgroundColor={Colors.blue}
                  onPress={this.onPressNext}
                  loading={loading}
                  buttonClass={`btn ${
                    !notificationsChecked || !privacyPolicyChecked
                      ? classes.buttonDisabled
                      : ""
                  }`}
                />
              </BottomView>
            </Wrapper>
          </Grid>
        </Grid>

        <ResponseView type="browser" toggleWidth={960}>
          <SideImage src={ImageSolarPlant} width={screenWidth / 3}>
            <SideOverLap />
            <PV padding={30} style={{ zIndex: 10 }}>
              <WhiteLText>Welcome to E-Observatory</WhiteLText>
              <WhiteSText>
                After a few questions, you will find out in what way you are
                contributing to the sustainable energy ecosystem.
              </WhiteSText>
              <WhiteSText>
                Your personal data will remain confidential, it will only be
                used for statistical purposes.
              </WhiteSText>
            </PV>
          </SideImage>
        </ResponseView>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  screenWidth: state.screenReducer.width,
  survey: state.surveyReducer,
  options: state.optionReducer,
});

const mapDispatchToProps = {
  saveInitialQuestion: surveyActions.saveInitialQuestion,
  getInitialResponses: surveyActions.getInitialResponses,
  resetSurvey: surveyActions.resetSurvey,
  updateQuestion: surveyActions.updateQuestion,
  postInitialResponses: surveyActions.postInitialResponses,
  getBusinessTypes: optionActions.getBusinessTypes,
  getCurrencyList: optionActions.getCurrencyList,
  getCountryList: optionActions.getCountryList,
  getRegions: optionActions.getRegions,
  getStages: optionActions.getStages,
  surveyVisit: surveyActions.surveyVisit,
  setPartnerName: surveyActions.setPartnerName,
  setSurveyYear: surveyActions.setSurveyYear,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withSnackbar(CompanyInfo))
);
