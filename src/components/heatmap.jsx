import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Heatmap extends Component {
  render() {
    const {
      data
    } = this.props;
    return <p>{data}</p>;
  }
}

export function mapStateToProps(state) {
  console.log('state', state);
  return {
    data: state.data
  };
}

export default connect(mapStateToProps)(Heatmap);