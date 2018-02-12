import React, { Component } from 'react';

import FilesInput from '../components/filesinput';
import Heatmap from '../components/heatmap';

export default class Home extends Component {

  render() {
    return (
      <div>
        <h1>Home</h1>
        <Heatmap />
        <FilesInput />
      </div>
    );
  }

}