import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'

import { updateStaffMap } from '../../actions/staff'

import './staffCard.scss'

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
  entryEdit = () => {
    const name = this.props.staffName
    const rest = this.props.staffData.rest
    const leave = this.props.staffData.leave
    const multiple = !!this.props.staffData.multiple
    const multipleCount = this.props.staffData.multipleCount || 2
    Taro.navigateTo({
      url: `/pages/staffEditor/staffEditor?name=${name}&rest=${rest}&leave=${leave}&multiple=${multiple}&multipleCount=${multipleCount}`
    })
  }
  /**
   * 切换休息状态
   */
  toggleRest = () => {
    const staffName = this.props.staffName
    const staffData = this.props.staffData
    let newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
    delete newStaffMap[staffName]
    newStaffMap[staffName] = {
      rest: !staffData.rest,
      leave: staffData.leave,
      multiple: staffData.multiple,
      multipleCount: staffData.multipleCount
    }
    this.props.onUpdateStaffMap(newStaffMap)
  }
  /**
   * 切换请假状态
   */
  toggleLeave = () => {
    const staffName = this.props.staffName
    const staffData = this.props.staffData
    let newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
    newStaffMap[staffName] = {
      rest: staffData.rest,
      leave: !staffData.leave,
      multiple: staffData.multiple,
      multipleCount: staffData.multipleCount
    }
    this.props.onUpdateStaffMap(newStaffMap)
  }

  deleteStaff = () => {
    const { staffName } = this.props
    Taro.showModal({
      title: '删除人员',
      content: `操作不可逆，确定要删除 ${staffName} 吗？`,
      success: (res) => {
        if (res.confirm) {
          const newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
          delete newStaffMap[staffName]
          this.props.onUpdateStaffMap(newStaffMap)
        }
      }
    })
  }

  render () {
    const staffData = this.props.staffData || {}
    const staffName = this.props.staffName || ''
    // const groups = this.props.groups || []
    const restClass = staffData.rest ? 'btn active' : 'btn'
    const leaveClass = staffData.leave ? 'btn active' : 'btn'
    return (
      <ScrollView className='staff-card-scroll-view' scrollX scrollWithAnimation>
        <View className='staff-card-container' onClick={this.entryEdit}>
          <View>
            <Text>{staffName}</Text>
            {staffData.rest ? <AtTag size='small' type='primary' active disabled>休</AtTag> : ''}
            {staffData.leave ? <AtTag size='small' type='primary' active disabled>假</AtTag> : ''}
          </View>
          {/* <View className='staff-groups'>
            {groups.join(', ')}
          </View> */}
        </View>
        <View className='operators'>
          <View className={restClass} onClick={this.toggleRest}>
            休息
          </View>
          <View className={leaveClass} onClick={this.toggleLeave}>
            请假
          </View>
          <View className='btn warn' onClick={this.deleteStaff}>
            删除
          </View>
        </View>
      </ScrollView>
    )
  }
}