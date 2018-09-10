import Taro from '@tarojs/taro'

import { UPDATE_TEAM_MAP } from '../constants/team'

const INITIAL_STATE = {
  teamMap: {}
}

export default function team (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TEAM_MAP:
      return {
        ...state,
        teamMap: action.data
      }
    default:
      return state
  }
}
