import React, { Component } from 'react';
import { connect } from 'react-redux';
import Exif from 'exif-js';

import {
  SET_LOCATION_DATA
} from '../actions/types';
import {
  latLngArrayToDecimal
} from '../util';

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

    for(let i = 0; i < files.length; i++) {
      const p = new Promise((resolve, reject) => {
        Exif.getData(files[i], function() {
          const lng = Exif.getTag(this, 'GPSLongitude');
          const lat = Exif.getTag(this, 'GPSLatitude');

          if (
            typeof lng === 'undefined' ||
            typeof lat === 'undefined'
          ) {
            reject(new Error(`Missing GPS data: ${this.name}`));
          }
          else {
            resolve({
              lng: latLngArrayToDecimal(lng),
              lat: latLngArrayToDecimal(lat)
            });
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