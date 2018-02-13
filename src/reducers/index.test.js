import { SET_LOCATION_DATA } from '../actions/types';
import * as reducer from './index';

describe('Reducers', () => {
  it('should be defined', () => {
    expect(reducer).toBeDefined();
  });

  describe('data reducer', () => {
    it('should be defined', () => {
      expect(reducer.data).toBeDefined();
    });

    it(`should return new state on ${SET_LOCATION_DATA}`, () => {
      const action = {
        type: SET_LOCATION_DATA,
        data: [{}]
      };
      let result = reducer.data(undefined, action);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      action.data.push({});
      result = reducer.data(result, action);
      expect(result.length).toBe(2);
      action.data = [];
      result = reducer.data(result, action);
      expect(result.length).toBe(0);
    });

    it('should return previous state on unknown action type', () => {
      const action = {
        type: 'UNKNOWN_TYPE',
        data: [{}]
      };
      let result = reducer.data(undefined, action);
      expect(result.length).toBe(0);
    });
  });
});