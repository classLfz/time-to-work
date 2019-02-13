import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'

import TeamCard from '../../components/teamCard/teamCard'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./team.scss')
    break

  case 'h5':
    require('./team-h5.scss')
    break
}

@connect(({ team }) => ({
  team
}))

export default class Teams extends Component {
  config = {
    navigationBarTitleText: '团队列表',
    navigationBarBackgroundColor: '#00897B',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      teamMap: {}
    }
  }
  
  componentDidShow () {
    this.refresh()
  }
  /**
   * 刷新列表信息
   */
  refresh () {
    const teamMap = this.props.team.teamMap
    this.setState({
      teamMap: teamMap
    })
  }
  /**
   * 进入添加团队页面
   */
  entryCreate () {
    Taro.navigateTo({
      url: `/pages/teamCreate/teamCreate`
    })
  }

  render () {
    let teamMap = this.state.teamMap
    let teamListCards = null
    const teamMapKeys = Object.keys(teamMap)
    if (teamMapKeys.length > 0) {
      teamListCards = teamMapKeys.map(team => {
        return (
          <TeamCard teamData={teamMap[team]} key={team.name} />
        )
      })
    } else {
      teamListCards = (
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
      <View className='team-container'>
        <View className='team-header'>
          <View className='icon-btn' onClick={this.entryCreate}>
            <AtIcon
              value='add-circle'
              size='24'
              color='#FFFFFF'>
            </AtIcon>
          </View>
        </View>
        {teamListCards}
      </View>
    )
  }
}