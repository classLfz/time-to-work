import Taro from '@tarojs/taro'

import { naturalSort } from '../utils'

import {
  UPDATE_TEAM_MAP
} from '../constants/team'

export const updateTeamMap = (data) => {
  // 排序
  let dataSorted = {}
  Object.keys(data).sort(naturalSort).forEach(item => {
    dataSorted[item] = data[item]
  })
  Taro.setStorageSync('teams', dataSorted)
  return {
    type: UPDATE_TEAM_MAP,
    data: dataSorted
  }
}
