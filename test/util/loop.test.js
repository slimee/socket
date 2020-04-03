const Loop = require('../../util/Loop')

function getLoop(elements, nextCount) {
  const loop = new Loop(elements)
  let value
  for (let i = 0; i < nextCount; i++) {
    value = loop.next()
  }
  return value
}

describe('loop', () => {
  test('gives undefined at beginning', () => {
    expect(new Loop(['alone']).get()).toEqual(undefined)
  })
  test('gives alone with one next', () => {
    expect(getLoop(['alone'], 1)).toEqual('alone')
  })
  test('gives alone with two next', () => {
    expect(getLoop(['alone'], 2)).toEqual('alone')
  })
  test('gives the loop', () => {
    expect(getLoop(['not', 'alone', 'yet'], 1)).toEqual('not')
    expect(getLoop(['not', 'alone', 'yet'], 2)).toEqual('alone')
    expect(getLoop(['not', 'alone', 'yet'], 3)).toEqual('yet')
    expect(getLoop(['not', 'alone', 'yet'], 4)).toEqual('not')
  })
})
