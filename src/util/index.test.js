import { latLngArrayToDecimal } from './index';

describe('latLngArrayToDecimal', () => {
  it('should be defined', () => {
    expect(latLngArrayToDecimal).toBeDefined();
    expect(typeof latLngArrayToDecimal).toBe('function');
  });

  it('should return a number with valid input', () => {
    const result = latLngArrayToDecimal([{
      numerator: 1,
      denominator: 1
    },{
      numerator: 1,
      denominator: 1
    },{
      numerator: 1,
      denominator: 1
    }]);
    expect(typeof result).toBe('number');
  });

  it('should return null with invalid input', () => {
    expect(latLngArrayToDecimal()).toBe(null);
    expect(latLngArrayToDecimal([{
      numerator: 1
    },{
      numerator: 1,
      denominator: 1
    },{
      numerator: 1,
      denominator: 1
    }])).toBe(null);
  })
});