import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Heatmap extends Component {
  render() {
    const {
      data
    } = this.props;
    const locations = data.map((item) => {
      return {
        longitude: item[0],
        latitude: item[1]
      }
    });
    const rows = locations.map((location, i) => {
      return <p key={i}>Longitude: {location.longitude}, Latitude: {location.latitude}</p>
    })
    return rows;
  }
}

function mapStateToProps(state) {
  return {
    data: state.data
  };
}

export default connect(mapStateToProps)(Heatmap);