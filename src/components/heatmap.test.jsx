import React from 'react';
import { shallow } from 'enzyme';
import { Heatmap } from './heatmap';

let heatmap;

const data = [{
  lat: 1,
  lng: 1
}];

beforeEach(() => {
  heatmap = shallow(<Heatmap data={data} />);
});

describe('<Heatman /> Component', () => {
  it('should render', () => {
    expect(heatmap).toBeDefined();
  });
});