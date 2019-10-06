import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtCheckbox, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import { connect } from '@tarojs/redux'
import { updateTeamMap, updateTeamSort } from '../../actions/team'
import { updateStaffMap, updateStaffGroup } from '../../actions/staff'

import resolveClipboardData from './resolveClipboardData.js'
import allot from './allot.js'

import TeamCard from '../../components/teamCard/teamCard'
import IntroCard from './introCard'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./index.scss')
    break

  case 'h5':
    require('./index-h5.scss')
    break
}

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  onUpdateTeamMap (data) {
    dispatch(updateTeamMap(data))
  },
  onUpdateTeamSort (data) {
    dispatch(updateTeamSort(data))
  },
  onUpdateStaffMap (data) {
    dispatch(updateStaffMap(data))
  },
  onUpdateStaffGroup (data) {
    dispatch(updateStaffGroup(data))
  }
}))

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstUpdated: false,
      teamAlloted: {},
      intervalMap: {
        '一天': 86400,
        '半天': 43200,
        '一小时': 3600,
        '不限制': 0
      },
      allotIntervalTime: 0,
      allotAndCopy: false,
      allotAndArchive: false,
      staffGroupsSelectOpened: false,
      allotStaffGroups: []
    }
  }

  config = {
    navigationBarTitleText: '分配工作',
    navigationBarBackgroundColor: '#5E35B1',
    navigationBarTextStyle: 'white'
  }

  componentDidShow () {
    const { onUpdateTeamMap, onUpdateTeamSort, onUpdateStaffMap, onUpdateStaffGroup } = this.props
    let teamMap = Taro.getStorageSync('teams') || {}
    let teamSort = Taro.getStorageSync('teamSort') || []
    let staffMap = Taro.getStorageSync('staff') || {}
    let staffGroup = Taro.getStorageSync('staffGroup') || {}
    // 首次更新store状态
    if (!this.state.firstUpdated) {
      onUpdateTeamMap(teamMap)
      onUpdateTeamSort(teamSort)
      onUpdateStaffMap(staffMap)
      onUpdateStaffGroup(staffGroup)
      this.setState({
        firstUpdated: true
      })
    }
    // 更新分配设置
    const allotAndCopy = Taro.getStorageSync('allotAndCopy')
    const allotAndArchive = Taro.getStorageSync('allotAndArchive')
    const allotInterval = Taro.getStorageSync('allotInterval') || '不限制'
    this.setState({
      allotAndCopy: allotAndCopy,
      allotAndArchive: allotAndArchive,
      allotIntervalTime: this.state.intervalMap[allotInterval]
    })
    if (process.env.TARO_ENV === 'h5') return
    Taro.getClipboardData().then(e => {
      let data = e.data
      if (/^分配工作/.test(data)) {
        Taro.showModal({
          title: '检测到自动导入内容',
          content: '是否将粘贴板内容进行自动导入？',
          success: (res) => {
            // 清空粘贴板
            Taro.setClipboardData({
              data: '',
              success: function () {
                // console.log('clear clipboard data.')
              }
            })
            if (!res.confirm) return
            [teamMap, staffMap] = resolveClipboardData(data, teamMap, staffMap)
            onUpdateTeamMap(teamMap)
            onUpdateStaffMap(staffMap)
          }
        })
      }
    })
  }
  /**
   * 进入归档记录列表页面
   */
  entryHistory = () => {
    Taro.navigateTo({
      url: `/pages/history/history`
    })
  }
  /**
   * 判别是否可以进行分配
   * @param {Object} e 点击事件
   */
  decideToAllot = (e) => {
    e.stopPropagation()
    const allotIntervalTime = this.state.allotIntervalTime
    if (allotIntervalTime !== 0) {
      let history = Taro.getStorageSync('history') || {}
      if (Object.keys(history).length === 0) {
        this.allot()
        return
      }
      const now = (new Date()).getTime()
      let historyKeys = Object.keys(history).sort((i1, i2) => {
        return parseInt(i2) - parseInt(i1)
      })
      if (parseInt(historyKeys[0]) + allotIntervalTime > now) {
        Taro.showModal({
          title: '警告',
          content: '未超过限制时间，是否强制进行分配',
          success: (res) => {
            if (res.confirm) {
              this.allot()
            }
          }
        })
        return
      }
      this.setState({
        staffGroupsSelectOpened: true
      })
    } else {
      this.setState({
        staffGroupsSelectOpened: true
      })
    }
  }
  /**
   * 分配工作
   */
  allot = () => {
    this.setState({
      staffGroupsSelectOpened: false,
    })
    const { team, staff } = this.props
    const { staffMap, staffGroup } = staff
    const { allotStaffGroups } = this.state
    if (allotStaffGroups.length === 0) {
      Taro.showToast({
        title: '请到职员页面添加职员小组',
        icon: 'none'
      })
      return
    }
    const teamMap = JSON.parse(JSON.stringify(team.teamMap))
    const allotStaffMap = {}
    allotStaffGroups.forEach(groupName => {
      const groupStaffs = staffGroup[groupName].staffs
      groupStaffs.forEach(staffName => {
        allotStaffMap[staffName] = staffMap[staffName]
      })
    })

    const result = allot(teamMap, allotStaffMap)
    this.setState({
      allotStaffGroups: []
    })
    if (result.type === 'error') {
      Taro.showToast({
        title: result.message,
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '分配任务中...',
      mask: true
    }).then(() => {
      setTimeout(() => {
        Taro.hideLoading()
        this.setState({
          teamAlloted: result.teamMap
        })
        if (this.state.allotAndArchive) {
          setTimeout(() => {
            this.archive()
          }, 0)
        }
        if (this.state.allotAndCopy) {
          setTimeout(() => {
            this.copy()
          }, 500)
        }
        Taro.showToast({
          title: '分配工作完成',
          icon: 'success'
        })
      }, 1000)
    })
  }
  /**
   * 清空本次分配信息
   */
  reset = () => {
    this.setState({
      teamAlloted: {}
    })
  }
  /**
   * 复制分配信息到用户粘贴板
   */
  copy = () => {
    const teamAlloted = this.state.teamAlloted
    if (Object.keys(teamAlloted).length <= 0) {
      Taro.showToast({
        title: '请先进行分配',
        icon: 'none'
      })
      return
    }
    let outStr = '分配好工作了：\n'
    let { teamSort, teamMap } = this.props.team
    if (teamSort.length === 0) teamSort = Object.keys(teamMap)
    teamSort.forEach(teamName => {
      let teamData = teamAlloted[teamName]
      outStr += `\n#\n团队：${teamName}\n`
      if (teamData.needLeader) {
        outStr += `负责人：${teamData.leader || ''}\n`
      }
      let jobs = teamData.jobs
      for (let job in jobs) {
        let jobData = jobs[job]
        outStr += `职位：${job}（${jobData.num}人）：`
        jobData.workers.forEach(worker => {
          outStr += `${worker}，`
        })
        outStr.replace('，', '')
        outStr += `\n`
      }
    })
    Taro.setClipboardData({
      data: outStr
    })
  }
  /**
   * 归档
   */
  archive = () => {
    const teamAlloted = this.state.teamAlloted
    if (Object.keys(teamAlloted).length === 0) {
      Taro.showToast({
        title: '请先进行分配',
        icon: 'none'
      })
      return
    }
    let now = new Date()
    let history = Taro.getStorageSync('history') || {}
    history[now.getTime()] = teamAlloted
    Taro.setStorageSync('history', history)
    Taro.showToast({
      title: '归档成功',
      icon: 'success'
    })
  }

  closeStaffGroupsSelector = () => {
    this.setState({
      staffGroupsSelectOpened: false,
      allotStaffGroups: []
    })
  }

  handleAllotStaffGroupsChange = (value) => {
    this.setState({
      allotStaffGroups: value
    })
  }

  render () {
    let teamMap = this.state.teamAlloted
    let { teamSort } = this.props.team
    if (teamSort.length === 0) teamSort = Object.keys(teamMap)
    let hideIntro = Object.keys(teamMap).length !== 0
    let i = 0
    let teamListCards = teamSort.map(team => {
      return (
        <TeamCard teamData={teamMap[team]} key={i++} justShow />
      )
    })

    const staffGroup = this.props.staff.staffGroup || {}
    const staffGroupOptions = Object.keys(staffGroup).map(groupName => {
      return {
        value: groupName,
        label: `${groupName}（${staffGroup[groupName].staffs.length}人）`
      }
    })

    return (
      <View className='index-container'>
        <View className='index-header'>
          <View onClick={this.entryHistory}>
            <AtIcon
              value='star-2'
              size='24'
              color='#FFFFFF'>
            </AtIcon>
          </View>
        </View>
        <View className='content'>
          <View hidden={hideIntro}>
            <IntroCard />
          </View>
          <View hidden={!hideIntro}>
            {teamListCards}
          </View>
        </View>
        <View className='operator-box'>
          <View className='operator'>
            <View className='icon-btn' onClick={this.decideToAllot}>
              <AtIcon
                value='play'
                size='40'
                color='#0D47A1'>
              </AtIcon>
            </View>
            <View className='icon-btn' onClick={this.reset}>
              <AtIcon
                value='stop'
                size='40'
                color='#004D40'>
              </AtIcon>
            </View>
            {process.env.TARO_ENV === 'h5' ? '' : (
              <View className='icon-btn' onClick={this.copy}>
                <AtIcon
                  value='download'
                  size='40'
                  color='#FF6D00'>
                </AtIcon>
              </View>
            )}
            <View className='icon-btn' onClick={this.archive}>
              <AtIcon
                value='star'
                size='40'
                color='#C51162'>
              </AtIcon>
            </View>
          </View>
        </View>

        <AtModal isOpened={this.state.staffGroupsSelectOpened}>
          <AtModalHeader>选择分配小组</AtModalHeader>
          <AtModalContent>
            {staffGroupOptions.length === 0 ?
              <View>暂无职员小组</View> :
              <AtCheckbox options={staffGroupOptions} selectedList={this.state.allotStaffGroups} onChange={this.handleAllotStaffGroupsChange}></AtCheckbox>
            }
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeStaffGroupsSelector}>取消</Button>
            <Button onClick={this.allot}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

