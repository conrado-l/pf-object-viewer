import getters from './object-detail.getters'

const object = {
  available: true,
  creation_date: 1553276685,
  description: 'An amazing red shirt',
  id: '126',
  name: 'Shirt',
  type: 'clothing'
}

const state = { object }

describe('getObject', () => {
  it('it should return the object', () => {
    const actual = getters.getObject(state)

    expect(actual).toEqual(object)
  })
})
