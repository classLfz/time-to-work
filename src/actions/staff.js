/* eslint-disable import/prefer-default-export */
import Taro from '@tarojs/taro'

import { naturalSort } from '../utils'

import {
  UPDATE_STAFF_MAP
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
