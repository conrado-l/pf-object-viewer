export const get = jest.fn().mockImplementation(() => Promise.resolve({ data: 'mockData' })) // eslint-disable-line

export default {
  get
}
