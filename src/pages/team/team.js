import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'

import TeamCard from '../../components/teamCard/teamCard'

import './team.scss'
import addTeamIcon from '../../images/add_people_white.png'

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
    const teamListCards = Object.keys(teamMap).map(team => {
      return (
        <TeamCard teamData={teamMap[team]} key={team.name} />
      )
    })
    return (
      <View className='team-container'>
        <View className='team-header'>
          <View>
            <View className='icon-btn' onClick={this.entryCreate}>
              <AtIcon
                value='add-circle'
                size='24'
                color='#FFFFFF'>
              </AtIcon>
            </View>
          </View>
        </View>
        {teamListCards}
      </View>
    )
  }
}