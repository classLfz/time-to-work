import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import { updateStaffMap } from '../../actions/staff'
import StaffCard from './staffCard'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./staff.scss')
    break

  case 'h5':
    require('./staff-h5.scss')
    break
}

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class Staff extends Component {
  config = {
    navigationBarTitleText: '职员列表',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
  }
  /**
   * 进入添加职员页面
   */
  entryCreate = () => {
    Taro.navigateTo({
      url: `/pages/staffCreate/staffCreate`
    })
  }

  /**
   * 清空职员列表
   */
  clear () {
    Taro.showModal({
      title: '清空职员列表',
      content: '操作不可逆，确定要清空职员列表吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onUpdateStaffMap({})
        }
      }
    })
  }

  render () {
    const staffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap)) || {}
    let staffMapCards = null
    const staffMapKeys = Object.keys(staffMap)
    if (staffMapKeys.length > 0) {
      staffMapCards = staffMapKeys.map(staff => {
        const staffData = staffMap[staff] || {}
        return (
          <StaffCard key={staff} staffName={staff} staffData={staffData} />
        )
      })
    } else {
      staffMapCards = (
        <View className='empty-container'>
          <AtIcon
            value='add-circle'
            size='80'
            color='#e0e0e0'
            onClick={this.entryCreate}></AtIcon>
        </View>
      )
    }
    return (
      <View className='staff-container'>
        <View className='staff-header'>
          <View class='staff-header-operator'>
            <View className='icon-btn' onClick={this.entryCreate}>
              <AtIcon
                value='add-circle'
                size='24'
                color='#FFFFFF'>
              </AtIcon>
            </View>

            <View className='icon-btn' onClick={this.clear}>
              <AtIcon
                value='trash'
                size='24'
                color='#e0e0e0'>
              </AtIcon>
            </View>
          </View>

          <View className='operator'>
            <View>姓名</View>
            <View>
              <Text className='title'>休息</Text>
              <Text className='title'>请假</Text>
            </View>
          </View>
        </View>
        {staffMapCards}
      </View>
    )
  }
}