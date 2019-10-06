import Taro, { Component } from '@tarojs/taro'
import { View, Text, Switch} from '@tarojs/components'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./setting.scss')
    break

  case 'h5':
    require('./setting-h5.scss')
    break
}

export default class Setting extends Component {
  constructor (props) {
    super(props)
    this.state = {
      allotInterval: '不限制',
      allotAndCopy: false,
      allotAndArchive: false,
      simpleClipboardMode: false,
      intervalList: ['一天', '半天', '一小时', '不限制']
    }
  }

  componentDidShow () {
    const allotInterval = Taro.getStorageSync('allotInterval') || '不限制'
    const allotAndArchive = Taro.getStorageSync('allotAndArchive')
    const allotAndCopy = Taro.getStorageSync('allotAndCopy')
    const simpleClipboardMode = Taro.getStorageSync('simpleClipboardMode') || false
    this.setState({
      allotInterval: allotInterval,
      allotAndArchive: allotAndArchive,
      allotAndCopy: allotAndCopy,
      simpleClipboardMode: simpleClipboardMode
    })
  }

  config = {
    navigationBarTitleText: '设置',
    navigationBarBackgroundColor: '#795548',
    navigationBarTextStyle: 'white'
  }

  /**
   * 打开时间间隔选择框
   */
  openTimeSheet = () => {
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
  allotAndCopyChange = (e) => {
    e.stopPropagation()
    Taro.setStorageSync('allotAndCopy', e.detail.value)
    this.setState({
      allotAndCopy: e.detail.value
    })
  }
  /**
   * 保存分配后归档选择
   */
  allotAndSaveChange = (e) => {
    e.stopPropagation()
    Taro.setStorageSync('allotAndArchive', e.detail.value)
    this.setState({
      allotAndArchive: e.detail.value
    })
  }
  simpleClipboardModeChange = (e) => {
    e.stopPropagation()
    Taro.setStorageSync('simpleClipboardMode', e.detail.value)
    this.setState({
      simpleClipboardMode: e.detail.value
    })
  }

  render () {
    const { allotAndArchive, allotAndCopy, simpleClipboardMode } = this.state
    return (
      <View className='setting-container'>
        <View className='setting-item' onClick={this.openTimeSheet}>
          <Text>分配时间间隔</Text>
          <Text>{this.state.allotInterval}</Text>
        </View>

        {process.env.TARO_ENV === 'h5' ? '' : (
          <View className='setting-item'>
            <Text>分配后复制到粘贴板</Text>
            <Switch checked={allotAndCopy} onChange={this.allotAndCopyChange} />
          </View>
        )}

        <View className='setting-item'>
          <Text>分配后归档</Text>
          <Switch checked={allotAndArchive} onChange={this.allotAndSaveChange} />
        </View>

        <View className='setting-item'>
          <Text>粘贴板文本简洁模式</Text>
          <Switch checked={simpleClipboardMode} onChange={this.simpleClipboardModeChange} />
        </View>
      </View>
    )
  }
}
