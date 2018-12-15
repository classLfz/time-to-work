import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import { connect } from '@tarojs/redux'
import { updateTeamMap } from '../../actions/team'
import { updateStaffMap } from '../../actions/staff'

import resolveClipboardData from './resolveClipboardData.js'
import allot from './allot.js'

import TeamCard from '../../components/teamCard/teamCard'
import IntroCard from './introCard'

import './index.scss'

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  updateTeamMap (data) {
    dispatch(updateTeamMap(data))
  },
  updateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class Index extends Component {
  config = {
    navigationBarTitleText: '该干活了',
    navigationBarBackgroundColor: '#5E35B1',
    navigationBarTextStyle: 'white'
  }

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
      allotAndArchive: false
    }
  }

  componentDidShow () {
    const { updateTeamMap, updateStaffMap } = this.props
    let teamMap = Taro.getStorageSync('teams') || {}
    let staffMap = Taro.getStorageSync('staff') || {}
    // 首次更新store状态
    if (!this.state.firstUpdated) {
      updateTeamMap(teamMap)
      updateStaffMap(staffMap)
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
    Taro.getClipboardData().then(e => {
      let data = e.data
      if (/^该干活了/.test(data)) {
        Taro.showModal({
          title: '检测到自动导入内容',
          content: '是否将粘贴板内容进行自动导入？',
          success: function (res) {
            // 清空粘贴板
            Taro.setClipboardData({
              data: '',
              success: function () {
                // console.log('clear clipboard data.')
              }
            })
            if (!res.confirm) return
            [teamMap, staffMap] = resolveClipboardData(data, teamMap, staffMap)
            updateTeamMap(teamMap)
            updateStaffMap(staffMap)
          }
        })
      }
    })
  }
  /**
   * 进入归档记录列表页面
   */
  entryHistory () {
    Taro.navigateTo({
      url: `/pages/history/history`
    })
  }
  /**
   * 判别是否可以进行分配
   * @param {Object} e 点击事件
   */
  decideToAllot (e) {
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
      this.allot()
    } else {
      this.allot()
    }
  }
  /**
   * 分配工作
   */
  allot () {
    const { team, staff } = this.props
    let teamMap = JSON.parse(JSON.stringify(team.teamMap))
    let staffMap = JSON.parse(JSON.stringify(staff.staffMap))
    const result = allot(teamMap, staffMap)
    if (result.type === 'error') {
      Taro.showToast({
        title: result.message,
        icon: 'none'
      })
      return
    }
    Taro.showLoading({
      title: '分配任务中...',
      mask: true,
      success: () => {
        setTimeout(() => {
          Taro.hideLoading()
          this.setState({
            teamAlloted: result.teamMap
          })
          Taro.showToast({
            title: '分配工作完成',
            icon: 'success'
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
        }, 1000)
      }
    })
  }
  /**
   * 清空本次分配信息
   */
  reset () {
    this.setState({
      teamAlloted: {}
    })
  }
  /**
   * 复制分配信息到用户粘贴板
   */
  copy () {
    const teamAlloted = this.state.teamAlloted
    if (Object.keys(teamAlloted).length <= 0) {
      Taro.showToast({
        title: '请先进行分配',
        icon: 'none'
      })
      return
    }
    let outStr = '你们该干活了：\n'
    for (let team in teamAlloted) {
      let teamData = teamAlloted[team]
      outStr += `\n#\n团队：${team}\n负责人：${teamData.leader || ''}\n`
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
    }
    Taro.setClipboardData({
      data: outStr
    })
  }
  /**
   * 归档
   */
  archive () {
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

  render () {
    let teamMap = this.state.teamAlloted
    let hideIntro = Object.keys(teamMap).length !== 0
    let teamListCards = Object.keys(teamMap).map(team => {
      return (
        <TeamCard teamData={teamMap[team]} key={team.name} justShow />
      )
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
        <View hidden={hideIntro}>
          <IntroCard />
        </View>
        <View hidden={!hideIntro}>
          {teamListCards}
        </View>
        <View className='operator'>
          <View className='icon-btn' onClick={this.decideToAllot}>
            <AtIcon
              value='play'
              size='42'
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
          <View className='icon-btn' onClick={this.copy}>
            <AtIcon
              value='download'
              size='38'
              color='#FF6D00'>
            </AtIcon>
          </View>
          <View className='icon-btn' onClick={this.archive}>
            <AtIcon
              value='star'
              size='38'
              color='#C51162'>
            </AtIcon>
          </View>
        </View>
      </View>
    )
  }
}

