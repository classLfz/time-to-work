import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Help extends Component {
  constructor (props) {
    super(props)
  }

  config = {
    navigationBarTitleText: '帮助文档',
    navigationBarBackgroundColor: '#43A047',
    navigationBarTextStyle: 'white'
  }

  render () {
    return (
      <View className='page-container'>
        <View className='title'>简介</View>
        <View className='content'>
          该小程序主要用于随机分配工作。按照团队及其岗位、职员小组、职员来进行随机分配。
        </View>

        <View className='title'>团队</View>
        <View className='content'>
          团队的作用主要是用于更好的组织岗位，举个例子：像驾照考试一样，分为不同的科目，而不同的科目下又有不同的岗位。
        </View>
        <View className='content'>
          团队可以指定一个负责人，也可以给对应的岗位指定某一位职员。
        </View>

        <View className='title'>职员</View>
        <View className='content'>
          跟团队类似，职员也需要归属到至少一个职员小组才能参与分配。
        </View>
        <View className='content'>
          一个职员可同时归属于不同的职员小组。
        </View>

        <View className='title'>数据储存</View>
        <View className='content'>
          数据储存全部储存在本地，所以存在大小限制，归档后的记录，会在储存不足时进行清除，敬请留意数据备份！
        </View>

        <View className='title'>版本升级</View>
        <View className='content'>
          版本的升级，可能会造成储存数据结构的变动，从而导致出错。如果遇到这种情况，可以考虑到设置页面进行一键【清空数据】操作。
        </View>
      </View>
    )
  }
}