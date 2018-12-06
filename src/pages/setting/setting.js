import Taro, { Component } from '@tarojs/taro'
import { View, Switch} from '@tarojs/components'

import './setting.scss'

export default class Setting extends Component {
  config = {
    navigationBarTitleText: '设置',
    navigationBarBackgroundColor: '#795548',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      allotInterval: '不限制',
      allotAndCopy: false,
      allotAndArchive: false,
      intervalList: ['一天', '半天', '一小时', '不限制']
    }
  }

  componentDidShow () {
    const allotInterval = Taro.getStorageSync('allotInterval') || '不限制'
    const allotAndArchive = Taro.getStorageSync('allotAndArchive')
    const allotAndCopy = Taro.getStorageSync('allotAndCopy')
    this.setState({
      allotInterval: allotInterval,
      allotAndArchive: allotAndArchive,
      allotAndCopy: allotAndCopy
    })
  }
  /**
   * 打开时间间隔选择框
   */
  openTimeSheet () {
    Taro.showActionSheet({
      itemList: this.state.intervalList,
      success: (res) => {
        const select = this.state.intervalList[res.tapIndex]
        Taro.setStorageSync('allotInterval', select)
        this.setState({
          allotInterval: select
        })
      }
    })
  }
  /**
   * 保存分配后复制选择
   */
  handleAllotAndCopyChange (e) {
    e.stopPropagation()
    Taro.setStorageSync('allotAndCopy', e.detail.value)
    this.setState({
      allotAndCopy: e.detail.value
    })
  }
  /**
   * 保存分配后归档选择
   */
  handleAllotAndSaveChange (e) {
    e.stopPropagation()
    Taro.setStorageSync('allotAndArchive', e.detail.value)
    this.setState({
      allotAndArchive: e.detail.value
    })
  }

  render () {
    const allotAndArchive = this.state.allotAndArchive
    const allotAndCopy = this.state.allotAndCopy
    return (
      <View className='setting-container'>
        <View class="setting-item" onClick={this.openTimeSheet}>
          <Text>分配时间间隔</Text>
          <Text>{this.state.allotInterval}</Text>
        </View>

        <View className='setting-item'>
          <Text>分配后复制到粘贴板</Text>
          <Switch checked={allotAndCopy} onChange={this.handleAllotAndCopyChange} />
        </View>

        <View className='setting-item'>
          <Text>分配后归档</Text>
          <Switch checked={allotAndArchive} onChange={this.handleAllotAndSaveChange} />
        </View>
      </View>
    )
  }
}
