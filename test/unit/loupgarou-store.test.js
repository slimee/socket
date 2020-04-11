const { isGood, isBad } = require('../../games/loup-garou/roles')
const LoupGarouStore = require('./../../games/loup-garou/LoupGarouStore')

describe('loupgarou store', () => {
  it('isGood', () => {
    expect(isGood('LG')).toBeFalsy()
    expect(isGood('Vil')).toBeTruthy()
    expect(isGood('Voy')).toBeTruthy()
    expect(isGood('Vol')).toBeTruthy()
    expect(isGood('Sor')).toBeTruthy()
  });

  it('isBad', () => {
    expect(isBad('LG')).toBeTruthy()
    expect(isBad('Vil')).toBeFalsy()
    expect(isBad('Voy')).toBeFalsy()
    expect(isBad('Vol')).toBeFalsy()
    expect(isBad('Sor')).toBeFalsy()
  });
})