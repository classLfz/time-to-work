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
      </View>
    )
  }
}