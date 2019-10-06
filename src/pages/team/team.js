import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import { updateTeamMap, updateTeamSort } from '../../actions/team'
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
}), (dispatch) => ({
  onUpdateTeamMap (data) {
    dispatch(updateTeamMap(data))
  },
  onUpdateTeamSort (data) {
    dispatch(updateTeamSort(data))
  }
}))

export default class Teams extends Component {
  constructor (props) {
    super(props)
    this.state = {
      teamMap: {},
      teamSort: []
    }
  }
  
  config = {
    navigationBarTitleText: '团队列表',
    navigationBarBackgroundColor: '#00897B',
    navigationBarTextStyle: 'white'
  }

  componentDidShow () {
    this.refresh()
  }
  /**
   * 刷新列表信息
   */
  refresh () {
    const teamMap = this.props.team.teamMap
    let teamSort = this.props.team.teamSort
    if (teamSort.length === 0) teamSort = Object.keys(teamMap)
    this.setState({
      teamMap: teamMap,
      teamSort: teamSort
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

  entrySort () {
    Taro.navigateTo({
      url: `/pages/teamSort/teamSort`
    })
  }

  /**
   * 清空团队列表
   */
  clear () {
    Taro.showModal({
      title: '清空团队列表',
      content: '操作不可逆，确定要清空团队列表吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onUpdateTeamMap({})
          this.refresh()
        }
      }
    })
  }

  render () {
    const { teamMap, teamSort } = this.state
    let teamListCards = null
    if (teamSort.length > 0) {
      let i = 0
      teamListCards = teamSort.map(teamName => {
        return (
          <TeamCard key={i++} teamData={teamMap[teamName]} />
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
          <View className='team-header-left'>
            <View className='icon-btn' onClick={this.entryCreate}>
              <AtIcon
                value='add-circle'
                size='24'
                color='#FFFFFF'>
              </AtIcon>
            </View>
            <View className='icon-btn' onClick={this.entrySort}>
              <AtIcon
                value='numbered-list'
                size='24'
                color='#FFFFFF'>
              </AtIcon>
            </View>
          </View>

          <View className='icon-btn' onClick={this.clear}>
            <AtIcon
              value='trash'
              size='24'
              color='#e0e0e0'>
            </AtIcon>
          </View>
        </View>
        {teamListCards}
      </View>
    )
  }
}