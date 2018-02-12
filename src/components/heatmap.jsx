import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Heatmap extends Component {
  render() {
    const {
      data
    } = this.props;

    const rows = data.map((item, i) => {
      return <p key={i}>Longitude: {item.lng}, Latitude: {item.lat}</p>
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