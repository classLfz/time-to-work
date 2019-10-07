import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtList, AtListItem } from 'taro-ui'
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
      teamSort: [],
      currentTeam: ''
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
  entryTeamCreate () {
    Taro.navigateTo({
      url: `/pages/teamCreate/teamCreate`
    })
  }

  entryTeamEdit = () => {
    const { currentTeam } = this.state
    if (!currentTeam) {
      Taro.showToast({
        title: '请选择团队进行编辑',
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/teamEdit/teamEdit?teamName=${currentTeam}`
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

  prev = () => {
    let { currentTeam, teamSort, teamMap } = this.state
    if (teamSort.length === 0) teamSort = Object.keys(teamMap)
    const index = teamSort.findIndex(i => i === currentTeam)
    let newCurrentTeam = teamSort[index - 1]
    if (currentTeam && index <= 0) {
      newCurrentTeam = ''
    }
    if (!currentTeam && teamSort.length >= 1) {
      newCurrentTeam = teamSort[teamSort.length - 1]
    }
    this.setState({
      currentTeam: newCurrentTeam
    })
    if (Taro.getStorageSync('defaultSelect')) {
      Taro.setStorageSync('currentTeam', newCurrentTeam)
    }
  }

  next = () => {
    let { currentTeam, teamSort, teamMap } = this.state
    if (teamSort.length === 0) teamSort = Object.keys(teamMap)
    const index = teamSort.findIndex(i => i === currentTeam)
    let newCurrentTeam = teamSort[index + 1]
    if (currentTeam && index + 1 >= teamSort.length) {
      newCurrentTeam = ''
    }
    this.setState({
      currentTeam: newCurrentTeam
    })
    if (Taro.getStorageSync('defaultSelect')) {
      Taro.setStorageSync('currentTeam', newCurrentTeam)
    }
  }

  render () {
    const { teamMap, teamSort, currentTeam } = this.state
    let teamListCards = null
    if (teamSort.length > 0 && !currentTeam) {
      let i = 0
      teamListCards = teamSort.map(teamName => {
        return (
          <TeamCard key={i++} teamData={teamMap[teamName]} />
        )
      })
    } else if (Object.keys(teamMap).length === 0) {
      teamListCards = (
        <View className='empty-container'>
          <AtIcon
            value='add-circle'
            size='80'
            color='#e0e0e0'
            onClick={this.entryCreate}></AtIcon>
        </View>
      )
    } else {
      const currentTeamVal = teamMap[currentTeam]
      let i = 0
      const jobKeys = Object.keys(currentTeamVal.jobs || {})
      const jobListEls = jobKeys.map(jobName => {
        return (
          <AtListItem key={i++} title={jobName} extraText={`${currentTeamVal.jobs[jobName].num}人`}></AtListItem>
        )
      })
      teamListCards = (
        <AtList>
          <AtListItem title='团队名称' extraText={currentTeamVal.name}></AtListItem>
          {currentTeamVal.needLeader ? <AtListItem title='负责人' extraText={currentTeamVal.leader}></AtListItem> : ''}
          <AtListItem title='岗位：' disabled></AtListItem>
          {jobListEls}
        </AtList>
      )
    }
    return (
      <View className='team-container'>
        <View className='team-header'>
          <View className='team-header-top'>
            <View className='team-header-left'>
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
          <View className='team-header-bottom'>
            { currentTeam ? `当前团队：${currentTeam}` : '所有团队列表' }
          </View>
        </View>
        {teamListCards}

        <View className='operators'>
          <AtIcon className='btn' value='chevron-left' size='40' color='#AD1457' onClick={this.prev}></AtIcon>
          <AtIcon className='btn' value='add' size='36' color='#C62828' onClick={this.entryTeamCreate}></AtIcon>
          <AtIcon className='btn' value='edit' size='36' color='#C62828' onClick={this.entryTeamEdit}></AtIcon>
          <AtIcon className='btn' value='chevron-right' size='40' color='#6A1B9A' onClick={this.next}></AtIcon>
        </View>
        {/* <View className='tipper'>当前选择团队，分配时则默认为当前团队</View> */}
      </View>
    )
  }
}