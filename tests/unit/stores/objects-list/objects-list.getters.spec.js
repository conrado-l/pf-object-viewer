import getters from './objects-list.getters'

const objects = [
  {
    available: false,
    creation_date: 1553276681,
    description: 'An amazing blue shirt',
    id: '125',
    name: 'Shirt',
    type: 'clothing'
  },
  {
    available: true,
    creation_date: 1553276685,
    description: 'An amazing red shirt',
    id: '126',
    name: 'Shirt',
    type: 'clothing'
  }
]

const state = { objects }

describe('getObjects', () => {
  it('it should return the objects', () => {
    const actual = getters.getObjects(state)

    expect(actual).toEqual(objects)
  })
})
