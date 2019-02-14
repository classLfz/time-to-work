import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './navHeader.scss'

export default class NavHeader extends Component {
  constructor (props) {
    super(props)
  }

  back = () => {
    Taro.navigateBack({ delta: 1 })
  }
  render () {
    return (
      <View className='header-container'>
        <View>
          <AtIcon value='chevron-left' size='24' color='#FFFFFF' onClick={this.back}></AtIcon>
        </View>
        <View className='title'>{this.props.title}</View>
        <View> </View>
      </View>
    )
  }
}
