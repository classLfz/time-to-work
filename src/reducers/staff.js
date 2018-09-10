import Taro from '@tarojs/taro'

import {
  UPDATE_STAFF_MAP
} from '../constants/staff'

const INITIAL_STATE = {
  staffMap: {}
}

export default function team (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_STAFF_MAP:
      return {
        ...state,
        staffMap: action.data
      }
    
    default:
      return state
  }
}
