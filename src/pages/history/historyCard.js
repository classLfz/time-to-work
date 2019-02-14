import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import { formatTime } from '../../utils'
import './historyCard.scss'

export default class HistoryCard extends Component {
  constructor (props) {
    super(props)
  }
  /**
   * 进入详情页面
   */
  entryDetail = () => {
    const key = this.props.keyData || ''
    Taro.navigateTo({
      url: `/pages/historyDetail/historyDetail?key=${key}`
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
          const key = this.props.keyData || ''
          delete history[key]
          Taro.setStorageSync('history', history)
          Taro.showToast({
            title: '删除记录成功',
            icon: 'success'
          })
          this.props.onRefresh()
        }
      }
    })
  }

  render () {
    const keyData = this.props.keyData || ''
    const timeStr = formatTime(parseInt(keyData))
    return (
      <View className='card-container'>
        <Text onClick={this.entryDetail}>{timeStr}</Text>
        <View onClick={this.delete}>
          <AtIcon
            value='trash'
            size='24'
            color='#ed4014'>
          </AtIcon>
        </View>
      </View>
    )
  }
}
