const LoupGarou = 'LoupGarou'
const Villageois = 'Villageois'
const Voyante = 'Voyante'
const Voleur = 'Voleur'
const Sorciere = 'Sorcière'

const Roles = Object.freeze({
  LoupGarou: 'LG',
  Villageois: 'Vil',
  Voyante: 'Voy',
  Voleur: 'Vol',
  Sorciere: 'Sor',
})

const Teams = Object.freeze({
  Good: [Villageois, Voyante, Voleur, Sorciere],
  Bad: [LoupGarou],
})

module.exports = {
  Roles,
  Teams,
  isGood: (role) => Teams.Good.includes(role),
  isBad: (role) => Teams.Bad.includes(role),
}