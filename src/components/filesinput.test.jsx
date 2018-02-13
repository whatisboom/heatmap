import React from 'react';
import { shallow } from 'enzyme';
import { FilesInput } from './filesinput';

let filesinput;

beforeEach(() => {
  filesinput = shallow(<FilesInput />);
});

describe('<FilesInput /> Component', () => {
  it('renders the input', () => {
    expect(filesinput.find('input').length).toEqual(1);
  });
});