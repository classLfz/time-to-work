import Taro from '@tarojs/taro'

import { naturalSort } from '../utils'

import {
  UPDATE_STAFF_MAP,
  UPDATE_STAFF_GROUP
} from '../constants/staff'

export const updateStaffMap = (data = {}) => {
  // 排序
  let dataSorted = {}
  Object.keys(data).sort(naturalSort).forEach(item => {
    dataSorted[item] = data[item]
  })
  Taro.setStorageSync('staff', dataSorted)
  return {
    type: UPDATE_STAFF_MAP,
    data: dataSorted
  }
}

export const updateStaffGroup = (data = {}) => {
  // 排序
  let dataSorted = {}
  Object.keys(data).sort(naturalSort).forEach(item => {
    dataSorted[item] = data[item]
  })
  Taro.setStorageSync('staffGroup', dataSorted)
  return {
    type: UPDATE_STAFF_GROUP,
    data: dataSorted
  }
}
