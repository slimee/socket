const Roles = Object.freeze({
  LoupGarou: 'LG',
  Villageois: 'Vil',
  Voyante: 'Voy',
  Voleur: 'Vol',
  Sorciere: 'Sor',
})

const Teams = Object.freeze({
  Good: [Roles.Villageois, Roles.Voyante, Roles.Voleur, Roles.Sorciere],
  Bad: [Roles.LoupGarou],
})

module.exports = {
  Roles,
  Teams,
  isGood: (role) => Teams.Good.includes(role),
  isBad: (role) => Teams.Bad.includes(role),
}