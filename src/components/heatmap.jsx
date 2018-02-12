import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  withGoogleMap,
  withScriptjs
} from 'react-google-maps';

const MapComponent = withScriptjs(withGoogleMap((props) => {
  <GoogleMap
    defaultZoom={4}
    defaultCenter={{
      lat: 30.2672,
      lng: -97.7431
    }}>
    <Marker position={{
      lat: 30.2672,
      lng: -97.7431
    }} />
  </GoogleMap>
}));

export class Heatmap extends Component {
  render() {
    const {
      data
    } = this.props;


    return (
      <MapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        />
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data
  };
}

export default connect(mapStateToProps)(Heatmap);