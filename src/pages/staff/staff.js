import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon } from 'taro-ui'
import { updateStaffMap, updateStaffGroup } from '../../actions/staff'
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
  },
  onUpdateStaffGroup (data) {
    dispatch(updateStaffGroup(data))
  }
}))

export default class Staff extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentGroup: ''
    }
  }

  config = {
    navigationBarTitleText: '职员列表',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }

  /**
   * 进入添加职员页面
   */
  entryCreate () {
    Taro.navigateTo({
      url: `/pages/staffEditor/staffEditor`
    })
  }

  entryGroupCreate () {
    Taro.navigateTo({
      url: '/pages/staffGroupEditor/staffGroupEditor'
    })
  }

  entryGroupEdit = () => {
    const { currentGroup } = this.state
    if (!currentGroup) {
      Taro.showToast({
        title: '请选择小组进行编辑',
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: `/pages/staffGroupEditor/staffGroupEditor?groupName=${currentGroup}`
    })
  }

  /**
   * 清空职员列表
   */
  clear () {
    Taro.showModal({
      title: '清空职员列表',
      content: '操作不可逆，确定要清空所有职员信息吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onUpdateStaffMap({})
          const { staffGroup } = this.props.staff
          for (let key in staffGroup) {
            staffGroup[key].staffs = []
          }
          this.props.onUpdateStaffGroup(staffGroup)
        }
      }
    })
  }

  prev = () => {
    const { currentGroup } = this.state
    const staffGroup = this.props.staff.staffGroup || {}
    const staffGroupKeys = Object.keys(staffGroup)
    const index = staffGroupKeys.findIndex(i => i === currentGroup)
    let newCurrentGroup = staffGroupKeys[index - 1]
    if (currentGroup && index <= 0) {
      newCurrentGroup = ''
    }
    if (!currentGroup && staffGroupKeys.length >= 1) {
      newCurrentGroup = staffGroupKeys[staffGroupKeys.length - 1]
    }
    this.setState({
      currentGroup: newCurrentGroup
    })
    if (Taro.getStorageSync('defaultSelect')) {
      Taro.setStorageSync('currentStaffGroup', newCurrentGroup)
    }
  }

  next = () => {
    const { currentGroup } = this.state
    const staffGroup = this.props.staff.staffGroup || {}
    const staffGroupKeys = Object.keys(staffGroup)
    const index = staffGroupKeys.findIndex(i => i === currentGroup)
    let newCurrentGroup = staffGroupKeys[index + 1]
    if (currentGroup && index + 1 >= staffGroupKeys.length) {
      newCurrentGroup = ''
    }
    this.setState({
      currentGroup: newCurrentGroup
    })
    if (Taro.getStorageSync('defaultSelect')) {
      Taro.setStorageSync('currentStaffGroup', newCurrentGroup)
    }
  }

  render () {
    let staffMapCards = null
    const { currentGroup } = this.state
    const { staffMap, staffGroup } = this.props.staff
    let currentStaffMap = {}
    if (staffGroup[currentGroup] && staffGroup[currentGroup].staffs) {
      staffGroup[currentGroup].staffs.forEach(staffName => {
        if (staffMap[staffName]) currentStaffMap[staffName] = staffMap[staffName]
      })
    }
    if (!currentGroup) currentStaffMap = JSON.parse(JSON.stringify(staffMap))
    const staffMapKeys = Object.keys(currentStaffMap)
    if (staffMapKeys.length > 0) {
      let i = 0
      staffMapCards = staffMapKeys.map(staff => {
        const staffData = currentStaffMap[staff] || {}
        return (
          <StaffCard key={i++} staffName={staff} staffData={staffData} />
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
          <View className='staff-header-operator'>
            <View className='staff-header-left'>
              <View className='icon-btn' onClick={this.entryCreate}>
                <AtIcon value='add-circle' size='24' color='#FFFFFF'></AtIcon>
              </View>
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
            { currentGroup ? <View>当前小组：{currentGroup}</View> : '所有职员列表' }
          </View>
        </View>
        {staffMapCards}

        <View className='operators'>
          <AtIcon className='btn' value='chevron-left' size='40' color='#AD1457' onClick={this.prev}></AtIcon>
          <AtIcon className='btn' value='add' size='36' color='#C62828' onClick={this.entryGroupCreate}></AtIcon>
          <AtIcon className='btn' value='edit' size='36' color='#C62828' onClick={this.entryGroupEdit}></AtIcon>
          <AtIcon className='btn' value='chevron-right' size='40' color='#6A1B9A' onClick={this.next}></AtIcon>
        </View>
        <View className='tipper'>将职员往左滑动，可进行快捷操作</View>
      </View>
    )
  }
}