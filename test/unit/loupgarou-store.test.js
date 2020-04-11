const { Roles } = require('../../games/loup-garou/roles')
const { isGood, isBad } = require('../../games/loup-garou/roles')
const LoupGarouStore = require('./../../games/loup-garou/LoupGarouStore')

const getStore = (players, roles, superConfig = {}) => {
  const store = new LoupGarouStore(superConfig, roles)
  store.state.players = players
  return store
}

describe('loupgarou store', () => {
  it('isGood', () => {
    expect(isGood('LG')).toBeFalsy()
    expect(isGood('Vil')).toBeTruthy()
    expect(isGood('Voy')).toBeTruthy()
    expect(isGood('Vol')).toBeTruthy()
    expect(isGood('Sor')).toBeTruthy()
  })

  it('isBad', () => {
    expect(isBad('LG')).toBeTruthy()
    expect(isBad('Vil')).toBeFalsy()
    expect(isBad('Voy')).toBeFalsy()
    expect(isBad('Vol')).toBeFalsy()
    expect(isBad('Sor')).toBeFalsy()
  })

  it('getPlayerRole', () => {
    const store = getStore(
      [
        { id: 1 },
        { id: 2, alive: false },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      [
        Roles.LoupGarou,
        Roles.Voyante,
        Roles.Villageois,
        Roles.Voyante,
        Roles.Voyante,
      ],
    )
    expect(store.getPlayerRole({ id: 1 })).toEqual(Roles.LoupGarou)
    expect(store.getPlayerRole({ id: 2, alive: false })).toEqual(Roles.Voyante)
    expect(store.getPlayerRole({ id: 3 })).toEqual(Roles.Villageois)
    expect(store.getPlayerRole({ id: 4 })).toEqual(Roles.Voyante)
    expect(store.getPlayerRole({ id: 5 })).toEqual(Roles.Voyante)
  })
  it('getPlayersByRole', () => {
    expect(getStore(
      [
        { id: 1 },
        { id: 2, alive: false },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      [
        Roles.LoupGarou,
        Roles.Voyante,
        Roles.Villageois,
        Roles.Voyante,
        Roles.Voyante,
      ],
    ).getPlayersByRole(Roles.Voyante))
      .toEqual([
        { id: 2, alive: false },
        { id: 4 },
        { id: 5 },
      ])
  })
  it('countAlivesByRole', () => {
    expect(getStore(
      [
        { id: 1, alive: true },
        { id: 2, alive: false },
        { id: 3, alive: true },
        { id: 4, alive: true },
        { id: 5, alive: true },
      ],
      [
        Roles.LoupGarou,
        Roles.Voyante,
        Roles.Villageois,
        Roles.Voyante,
        Roles.Voyante,
      ],
    ).countAlivesByRole(Roles.Voyante)).toEqual(2)
  })
  it('swapRoles', () => {
    const store = getStore(
      [
        { id: 1 },
        { id: 2, alive: false },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
      [
        Roles.LoupGarou,
        Roles.Voyante,
        Roles.Villageois,
        Roles.Voleur,
        Roles.Voyante,
      ],
    )
    store.swapRoles({ id: 4 }, { id: 2 })
    expect(store.getPlayerRole({ id: 4 })).toEqual(Roles.Voyante)
    expect(store.getPlayerRole({ id: 2 })).toEqual(Roles.Voleur)
  })
})