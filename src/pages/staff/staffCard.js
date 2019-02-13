import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { updateStaffMap } from '../../actions/staff'

import './staffCard.scss'
import checkIcon from '../../images/check_red.png'
import unCheckIcon from '../../images/uncheck_gray.png'

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class StaffCard extends Component {
  constructor (props) {
    super(props)
  }
  /**
   * 进入职员编辑页面
   */
  entryEdit () {
    let name = this.props.staffName
    let rest = this.props.staffData.rest
    let leave = this.props.staffData.leave
    Taro.navigateTo({
      url: `/pages/staffEdit/staffEdit?name=${name}&rest=${rest}&leave=${leave}`
    })
  }
  /**
   * 切换休息状态
   */
  toggleRest () {
    const staffName = this.props.staffName
    const staffData = this.props.staffData
    let newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
    delete newStaffMap[staffName]
    newStaffMap[staffName] = {
      rest: !staffData.rest,
      leave: staffData.leave
    }
    this.props.onUpdateStaffMap(newStaffMap)
  }
  /**
   * 切换请假状态
   */
  toggleLeave () {
    const staffName = this.props.staffName
    const staffData = this.props.staffData
    let newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
    newStaffMap[staffName] = {
      rest: staffData.rest,
      leave: !staffData.leave
    }
    this.props.onUpdateStaffMap(newStaffMap)
  }

  render () {
    const staffData = this.props.staffData || {}
    const staffName = this.props.staffName || ''
    const restIconSrc = staffData.rest
      ? checkIcon
      : unCheckIcon

    const leaveIconSrc = staffData.leave
      ? checkIcon
      : unCheckIcon
    return (
      <View className='staff-card-container'>
        <Text onClick={this.entryEdit}>{staffName}</Text>
        <View>
          <View className='icon-container' onClick={this.toggleRest}>
            <Image className='icon' src={restIconSrc} />
          </View>
          <View className='icon-container' onClick={this.toggleLeave}>
            <Image className='icon' src={leaveIconSrc} />
          </View>
        </View>
      </View>
    )
  }
}