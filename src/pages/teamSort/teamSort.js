import Taro, { Component } from '@tarojs/taro'
import { View, MovableArea, MovableView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { updateTeamSort } from '../../actions/team'

@connect(({ team }) => ({
  team
}), (dispatch) => ({
  onUpdateTeamSort (data) {
    dispatch(updateTeamSort(data))
  }
}))

export default class TeamSort extends Component {
  constructor (props) {
    super(props)
    this.state = {
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

  refresh () {
    let { teamSort, teamMap } = this.props.team
    if (teamSort.length === 0) {
      teamSort = Object.keys(teamMap)
    }
    this.setState({
      teamSort: teamSort
    })
  }

  handleItemTouchend (e) {
    const currentTeamName = e.currentTarget.dataset.team
    const { teamSort } = this.state
    const newTeamSort = JSON.parse(JSON.stringify(teamSort))
    const oldIndex = newTeamSort.findIndex(item => item === currentTeamName)
    let newIndex = Math.round((e.changedTouches[0].pageY - 80) / 80)
    newTeamSort.splice(oldIndex, 1)
    newTeamSort.splice(newIndex, 0, currentTeamName)
    this.props.onUpdateTeamSort(newTeamSort)
    this.setState({
      teamSort: []
    })
    setTimeout(() => {
      this.refresh()
    }, 0)
  }

  render () {
    const { teamSort } = this.state
    let i = 0
    const teamList = teamSort.map(teamName => {
      const y = i * 50 + 36
      i++
      return (
        <MovableView
          className='team-box'
          key={teamName}
          direction='vertical'
          y={y}
          data-team={teamName}
          onTouchEnd={this.handleItemTouchend}>
          <View className='team-item'>{teamName}</View>
        </MovableView>
      )
    })

    return (
      <MovableArea className='container'>
        <View className='tip'>拖拽进行排序</View>
        {teamList}
      </MovableArea>
    )
  }
}
