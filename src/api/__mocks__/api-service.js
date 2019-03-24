/* eslint-disable */ // TODO: enable eslint when the API service is completely mocked
import { get } from '@/api/api-service'

let url = ''

jest.mock('../api-service.js', () => ({
  get: (_url) => {
    return new Promise((resolve) => {
      url = _url
      resolve(true)
    })
  }
}))
