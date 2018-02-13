import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';
import Heatmap from '../components/heatmap';
import FilesInput from '../components/filesinput';

let home;

beforeEach(() => {
  home = shallow(<Home />);
});

describe('<Home /> Container', () => {
  it('renders a single <h1>', () => {
    expect(home.find('h1').length).toEqual(1);
  });

  it('should contain a single <Heatmap /> component', () => {
    expect(home.find(Heatmap).length).toEqual(1);
  });

  it('should contain a single <FilesInput /> component', () => {
    expect(home.find(FilesInput).length).toEqual(1);
  });
});
