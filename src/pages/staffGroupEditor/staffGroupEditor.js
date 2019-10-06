import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Button } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './staffGroupEditor.scss'
import { updateStaffGroup } from '../../actions/staff'

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffGroup (data) {
    dispatch(updateStaffGroup(data))
  }
}))

export default class StaffGroupCreate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      edit: false,
      groupName: '',
      staffGroup: {},
      staffPicking: false,
      staffList: []
    }
  }

  componentWillMount () {
    const staffGroup = this.props.staff.staffGroup || {}
    const groupName = this.$router.params.groupName || ''
    const staffList = staffGroup[groupName] && staffGroup[groupName].staffs ? staffGroup[groupName].staffs : []
    this.setState({
      staffGroup: staffGroup,
      edit: !!groupName,
      groupName: groupName || '',
      staffList: staffList
    })
    Taro.setNavigationBarTitle({
      title: !!groupName ? '编辑职员小组' : '添加职员小组'
    })
  }

  config = {
    navigationBarTitleText: '添加职员小组',
    navigationBarBackgroundColor: '#0D47A1',
    navigationBarTextStyle: 'white'
  }

  openStaffPicker () {
    this.setState({
      staffPicking: true
    })
  }

  handlePickingClose () {
    this.setState({
      staffPicking: false
    })
  }

  handleTagClick (e) {
    const { active, name } = e
    const newStaffList = JSON.parse(JSON.stringify(this.state.staffList))
    const staffSet = new Set(newStaffList)
    if (!active) {
      staffSet.add(name)
    } else {
      staffSet.delete(name)
    }
    this.setState({
      staffList: [...staffSet]
    })
  }

  delete () {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该职员小组吗？',
      success: (res) => {
        if (res.confirm) {
          const { groupName } = this.state
          const newStaffGroup = JSON.parse(JSON.stringify(this.props.staff.staffGroup))
          delete newStaffGroup[groupName]
          this.props.onUpdateStaffGroup(newStaffGroup)
          Taro.navigateBack({ delta: 1 })
        }
      }
    })
  }

  submit (e) {
    const formData = e.detail.value
    const newName = formData.name.trim()
    if (!newName) {
      Taro.showToast({
        title: '小组名称不能为空',
        icon: 'none'
      })
      return
    }
    const newStaffGroup = JSON.parse(JSON.stringify(this.state.staffGroup))
    const { edit, groupName } = this.state
    if (!edit && newStaffGroup[newName]) {
      Taro.showToast({
        title: '同名小组已存在，请检查',
        icon: 'none'
      })
      return
    }
    delete newStaffGroup[groupName]
    newStaffGroup[newName] = {
      name: newName,
      staffs: this.state.staffList
    }
    this.props.onUpdateStaffGroup(newStaffGroup)
    Taro.navigateBack({
      delta: 1
    })
  }

  render () {
    const staffMap = this.props.staff ? this.props.staff.staffMap : {}
    const staffList = this.state.staffList
    // 人员列表
    let i = 0
    const staffListSelectEls = Object.keys(staffMap).sort().map(staff => {
      return (
        <View className='tag' key={i++}>
          <AtTag className='tag' name={staff} active={staffList.includes(staff)} onClick={this.handleTagClick.bind(this)}>{staff}</AtTag>
        </View>
      )
    })
    let j = 0
    const staffListEls = staffList.sort().map(staff => {
      return (
        <View className='tag' key={j++}>
          <AtTag className='tag' name={staff} active>{staff}</AtTag>
        </View>
      )
    })
    const deleteBtn = this.state.edit ? (
      <Button type='warn' className='form-btn warn' onClick={this.delete}>删除</Button>
    ) : ''

    return (
      <View className='page-container'>
        <Form onSubmit={this.submit} className='form-container'>
          <View className='form-item'>
            <Text className='title'>小组名称</Text>
            <Input className='item-input' name='name' value={this.state.groupName} autoFocus></Input>
          </View>

          <View className='form-item-column'>
            <View className='form-item-header'>
              <Text className='title'>小组成员</Text>
              <View onClick={this.openStaffPicker}>
                <AtIcon value='edit' size='24'></AtIcon>
              </View>
            </View>
            <View className='tags-list'>
              {staffListEls}
            </View>
          </View>

          <AtFloatLayout
            isOpened={this.state.staffPicking}
            title='选择小组人员'
            onClose={this.handlePickingClose}>
            <View className='tags-list'>
              {staffListSelectEls}
            </View>
          </AtFloatLayout>

          <View className='form-btns'>
            {deleteBtn}
            <Button type='primary' formType='submit' className='form-btn submit'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}