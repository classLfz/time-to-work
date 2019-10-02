import Taro from '@tarojs/taro'

import { UPDATE_TEAM_MAP, UPDATE_TEAM_SORT } from '../constants/team'

const INITIAL_STATE = {
  teamMap: {},
  teamSort: []
}

export default function team (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TEAM_MAP:
      return {
        ...state,
        teamMap: action.data
      }
    case UPDATE_TEAM_SORT:
      return {
        ...state,
        teamSort: action.data
      }
    default:
      return state
  }
}
