import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';

import { logoCleantech, logoErenovables, logoGreenuniversPng, logoInnoenergy } from '../assets/images';

const styles = {
  img: {
    width: '300px',
    height: '110px',
    backgroundSize: 'contain',
    backgroundPosition: 'left bottom'
  }
}

class Logo extends React.Component {

  render() {

    let { userName } = this.props;

    if (!userName) {
      userName = 'innoenergy';
    }

    const logos = {
      EnergiasRenovables: logoErenovables,
      GreenUnivers: logoGreenuniversPng,
      Innoenergy: logoInnoenergy,
      CleanTechAlps: logoCleantech,
      energiasrenovables: logoErenovables,
      greenunivers: logoGreenuniversPng,
      innoenergy: logoInnoenergy,
      cleantechalps: logoCleantech
    };

    return (

      <CardMedia
        className={this.props.className}
        style={styles.img}
        image={logos[userName] || logoInnoenergy}
        title={`${userName} logo`}
      />
    );

  }
}

export default Logo;
