import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import TeamCard from '../../components/teamCard/teamCard'
import NavHeader from '../../components/navHeader/navHeader.js'

import { formatTime } from '../../utils'
import './historyDetail.scss'

export default class HistoryDetail extends Component {
  config = {
    navigationBarTitleText: '记录详情',
    navigationBarBackgroundColor: '#5E35B1',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      time: 0,
      allotedData: {}
    }
  }

  componentWillMount () {
    const history = Taro.getStorageSync('history') || {}
    const historyKey = this.$router.params.key || 0
    const allotedData = history[historyKey]
    this.setState({
      time: parseInt(historyKey),
      allotedData: allotedData
    })
  }
  /**
   * 删除该记录
   */
  delete = () => {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该记录吗？',
      success: (res) => {
        if (res.confirm) {
          const history = Taro.getStorageSync('history') || {}
          const key = this.state.time || ''
          delete history[key]
          Taro.setStorageSync('history', history)
          Taro.showToast({
            title: '删除记录成功',
            icon: 'success'
          })
          Taro.navigateBack({ delta: 1 })
        }
      }
    })
  }

  render () {
    const teamMap = this.state.allotedData
    const timeStr = formatTime(this.state.time)
    let i = 0
    const teamListCards = Object.keys(teamMap).map(team => {
      return (
        <TeamCard teamData={teamMap[team]} key={i++} justShow />
      )
    })
    const title = '归档记录详情'
    return (
      <View className='detail-container'>
        {process.env.TARO_ENV === 'h5' ? (<NavHeader title={title} />) : ''}
        <View className='time-title'>{timeStr}</View>
        {teamListCards}
        <View className='detail-btns'>
          <Button type='warn' onClick={this.delete}>删除</Button>
        </View>
      </View>
    )
  }
}
