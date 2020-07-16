import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Text } from '../../../styles/global';


class CompanyTab extends React.Component {

  getCountryFromID = id => {

    let selectedCountry = this.props.options.countryList.filter(country => {
        return country.value === id;
    });

    if (selectedCountry.length) {
        return selectedCountry[0].label;
    }

    return '';
  }

  getRegionFromID = (country, id) => {

    let selectedRegion = this.props.options.regionList.filter(region => {
        return ( region.value === Number(id) && region.item === country );
    });

    if (selectedRegion.length) {
        return selectedRegion[0].label;
    }

    return '';
  }

  render() {

    const { selected_company } = this.props;

    return(
      <Grid className="companyInfo">
        <div className="labelValue">
          <label>Company name</label>
          <Text>{selected_company.company_name}</Text>
        </div>

        <div className="labelValue">
          <label>Activity</label>
          <Text>{selected_company.activity}</Text>
        </div>

        <div className="labelValue">
          <label>Year incorporated</label>
          <Text>{selected_company.year_incorporated}</Text>
        </div>

        <div className="labelValue">
          <label>Was in an incubation program?</label>
          <Text>{selected_company.incubation_program ? 'Yes' : 'No'}</Text>
        </div>

        <div className="labelValue">
          <label>Website</label>
          <Text>{selected_company.website}</Text>
        </div>

        <div className="labelValue">
          <label>Country</label>
          <Text>{this.getCountryFromID(selected_company.country_id)}</Text>
        </div>

        <div className="labelValue">
          <label>Region</label>
          <Text>{this.getRegionFromID(selected_company.country_id, selected_company.region_id)}</Text>
        </div>

        <div className="labelValue">
          <label>Number of co-founders</label>
          <Text>{selected_company.number_of_co_founders}</Text>
        </div>

        {/*
        <div className="labelValue">
          <label>Number of employees</label>
          <Text>{selected_company.number_of_employees}</Text>
        </div>
        */}
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  selected_company: state.dashboardReducer.selected_company,
  options: state.optionReducer
});

const mapDispatchToProps = ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTab);
