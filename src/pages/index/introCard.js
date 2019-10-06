import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import { connect } from '@tarojs/redux'

import './introCard.scss'

@connect(({ team, staff }) => ({
  team,
  staff
}))

export default class IntroCard extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const teamMap = this.props.team.teamMap || {}
    const staffMap = this.props.staff.staffMap || {}
    let restCount = 0
    let leaveCount = 0
    Object.keys(staffMap).forEach(staffName => {
      if (staffMap[staffName].rest) restCount++
      if (staffMap[staffName].leave) leaveCount++
    })
    return (
      <View>
        <View className='count-item'>
          <Text>总团队数</Text>
          <Text>{Object.keys(teamMap).length}</Text>
        </View>
        <View className='count-item'>
          <Text>总职员数</Text>
          <Text>{Object.keys(staffMap).length}</Text>
        </View>
        <View className='count-item'>
          <Text>休息人数</Text>
          <Text>{restCount}</Text>
        </View>
        <View className='count-item'>
          <Text>请假人数</Text>
          <Text>{leaveCount}</Text>
        </View>
      </View>
    )
  }
}