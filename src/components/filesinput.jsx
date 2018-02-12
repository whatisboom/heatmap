import React, { Component } from 'react';
import { connect } from 'react-redux';
import Exif from 'exif-js';

import {
  SET_LOCATION_DATA
} from '../actions/types';

export class FilesInput extends Component {

  async handleChange(e) {
    const {
      setData
    } = this.props;

    try {
      const data = await this.readFiles(e.target.files);
      setData(data);
    } catch (e) {
      console.error(e);
    }
  }

  readFiles(files) {
    const promises = [];

    function toDecimal(number) {
      return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
    }

    for(let i = 0; i < files.length; i++) {
      const p = new Promise((resolve, reject) => {
        Exif.getData(files[i], function() {
          const longitude = Exif.getTag(this, 'GPSLongitude');
          const latitude = Exif.getTag(this, 'GPSLatitude');
          if (!longitude || !latitude) {
            reject(new Error(`Missing GPS data: ${this.name}`));
          }
          else {
            resolve([toDecimal(longitude), toDecimal(latitude)]);
          }
        });
      });
      promises.push(p);
    }
    return Promise.all(promises);
  }

  render() {
    return <input type="file" accept=".jpg" multiple onChange={this.handleChange.bind(this)} />;
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    setData: (data) => dispatch({
      type: SET_LOCATION_DATA,
      data
    })
  }
}

export default connect(() => ({}), mapDispatchToProps)(FilesInput);