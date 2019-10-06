import Taro from '@tarojs/taro'

import {
  UPDATE_STAFF_MAP,
  UPDATE_STAFF_GROUP
} from '../constants/staff'

const INITIAL_STATE = {
  staffMap: {},
  staffGroup: {}
}

export default function team (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_STAFF_MAP:
      return {
        ...state,
        staffMap: action.data
      }
    case UPDATE_STAFF_GROUP:
      return {
        ...state,
        staffGroup: action.data
      }
    default:
      return state
  }
}
