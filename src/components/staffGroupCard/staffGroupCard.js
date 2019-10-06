import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard } from 'taro-ui'

import './staffGroupCard.scss'

export default class staffGroupCard extends Component {
  constructor (props) {
    super(props)
  }

  entryStaffGroupEdit (e) {
    const { name } = e.currentTarget.dataset
    Taro.navigateTo({
      url: `/pages/staffGroupEditor/staffGroupEditor?groupName=${name}`
    })
  }

  render () {
    const groupData = this.props.groupData || {}
    const staffList = groupData.staffs || []
    let i = 0
    const staffListEls = staffList.map(staffName => {
      return <Text key={i++} className='staff-item'>{staffName}</Text>
    })
    return (
      <View className='staff-card-container' data-name={groupData.name} onClick={this.entryStaffGroupEdit}>
        <AtCard title={groupData.name}>
          {staffListEls}
        </AtCard>
      </View>
    )
  }
}
