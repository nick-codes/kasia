/* global jest:false */

import { setWP } from '../../src/wpapi'

export const wpapi = {
  posts: jest.fn(),
  registerRoute: jest.fn()
}

export default setWP(wpapi)
