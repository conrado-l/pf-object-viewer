import mutations from './objects-list.mutations.js'

describe('SET_OBJECTS', () => {
  it('should set the objects passed as paramater to the state', () => {
    const mockupObjects = [
      {
        available: false,
        creation_date: 1553276681,
        description: 'An amazing blue shirt',
        id: '125',
        name: 'Shirt',
        type: 'clothing'
      },
      {
        available: false,
        creation_date: 1553276681,
        description: 'An amazing blue shirt',
        id: '125',
        name: 'Shirt',
        type: 'clothing'
      }
    ]

    const state = {
      objects: null
    }

    mutations.SET_OBJECTS(state, { objects: mockupObjects })

    expect(state).toEqual({
      objects: mockupObjects
    })
  })
})
