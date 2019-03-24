import mutations from './object-detail.mutations.js'

describe('SET_OBJECT', () => {
  it('should set the object passed as paramater to the state', () => {
    const mockupObject = {
      available: false,
      creation_date: 1553276681,
      description: 'An amazing blue shirt',
      id: '125',
      name: 'Shirt',
      type: 'clothing'
    }

    const state = {
      object: null
    }

    mutations.SET_OBJECT(state, { object: mockupObject })

    expect(state).toEqual({
      object: mockupObject
    })
  })
})
