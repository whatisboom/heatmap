export function latLngArrayToDecimal(number) {
  if (!number || number.length !== 3) {
    return null;
  } else {
    const valid = number.every(item => {
      return typeof item.numerator !== 'undefined' &&
        typeof item.denominator !== 'undefined';
    });
    if (!valid) {
      return null;
    }
  }
  return number[0].numerator + number[1].numerator / (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator);
}