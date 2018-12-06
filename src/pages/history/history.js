import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import HistoryCard from './historyCard.js'

export default class History extends Component {
  config = {
    navigationBarTitleText: '归档记录',
    navigationBarBackgroundColor: '#5E35B1',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      historyKeyList: []
    }
  }

  componentDidShow () {
    this.refresh()
  }
  /**
   * 刷新归档记录列表信息
   */
  refresh () {
    const history = Taro.getStorageSync('history') || {}
    this.setState({
      historyKeyList: Object.keys(history).sort((i1, i2) => {
        return parseInt(i2) - parseInt(i1)
      })
    })
  }

  render () {
    const historyKeyList = this.state.historyKeyList
    const cardList = historyKeyList.map(key => {
      return (
        <HistoryCard key={key} keyData={key} onRefresh={this.refresh} />
      )
    })
    return (
      <View>
        {cardList}
      </View>
    )
  }
}
