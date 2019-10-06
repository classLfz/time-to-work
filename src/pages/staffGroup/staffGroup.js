import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { updateStaffGroup } from '../../actions/staff'
import StaffGroupCard from '../../components/staffGroupCard/staffGroupCard'

import './staffGroup.scss'

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffGroup (data) {
    dispatch(updateStaffGroup(data))
  }
}))

export default class StaffGroup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      staffGroup: {}
    }
  }

  config = {
    navigationBarTitleText: '职员小组',
    navigationBarBackgroundColor: '#0D47A1',
    navigationBarTextStyle: 'white'
  }

  componentDidShow () {
    this.refresh()
  }

  refresh () {
    const staffGroup = this.props.staff.staffGroup
    this.setState({
      staffGroup
    })
  }

  entryGroupCreate () {
    Taro.navigateTo({
      url: '/pages/staffGroupEditor/staffGroupEditor'
    })
  }

  render() {
    const { staffGroup } = this.state
    let staffGroupListCards = null
    const staffGroupKeys = Object.keys(staffGroup)
    if (staffGroupKeys.length > 0) {
      staffGroupListCards = staffGroupKeys.map(groupName => {
        return (
          // <View key={groupName}>{groupName}</View>
          <StaffGroupCard key={groupName} groupData={staffGroup[groupName]}></StaffGroupCard>
        )
      })
    } else {
      staffGroupListCards = (
        <View className='empty-container'>
          <AtIcon value='add-circle' size='80' color='#e0e0e0' onClick={this.entryGroupCreate}></AtIcon>
        </View>
      )
    }
    return (
      <View className='page-container'>
        <View className='header'>
          <View onClick={this.entryGroupCreate}>
            <AtIcon value='add-circle' size='24' color='#FFFFFF'></AtIcon>
          </View>
        </View>
        <View className='staff-group-list'>
          {staffGroupListCards}
        </View>
      </View>
    )
  }
}
