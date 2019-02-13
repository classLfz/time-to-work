import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'

import StaffCard from './staffCard'

import './staff.scss'

@connect(({ staff }) => ({
  staff
}))

export default class Staff extends Component {
  config = {
    navigationBarTitleText: '职员列表',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
  }
  /**
   * 进入添加职员页面
   */
  entryCreate () {
    Taro.navigateTo({
      url: `/pages/staffCreate/staffCreate`
    })
  }

  render () {
    const staffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap)) || {}
    let staffMapCards = null
    const staffMapKeys = Object.keys(staffMap)
    if (staffMapKeys.length > 0) {
      staffMapCards = staffMapKeys.map(staff => {
        const staffData = staffMap[staff] || {}
        return (
          <StaffCard key={staff} staffName={staff} staffData={staffData} />
        )
      })
    } else {
      staffMapCards = (
        <View className='empty-container'>
          <AtIcon
            value='add-circle'
            size='80'
            color='#e0e0e0'
            onClick={this.entryCreate}></AtIcon>
        </View>
      )
    }
    return (
      <View className='staff-container'>
        <View className='staff-header'>
          <View>
            <View className='icon-btn' onClick={this.entryCreate}>
              <AtIcon
                value='add-circle'
                size='24'
                color='#FFFFFF'>
              </AtIcon>
            </View>
          </View>
          <View className='operator'>
            <Text>姓名</Text>
            <View>
              <Text className='title'>休息</Text>
              <Text className='title'>请假</Text>
            </View>
          </View>
        </View>
        {staffMapCards}
      </View>
    )
  }
}