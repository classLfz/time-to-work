import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import { updateStaffMap } from '../../actions/staff'

import './staffCreate.scss'

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  updateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class StaffCreate extends Component {
  config = {
    navigationBarTitleText: '增加职员',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }
  
  constructor (props) {
    super (props)
  }
  /**
   * 提交表单，创建职员
   * @param {Object} e 点击事件
   */
  submit (e) {
    const formData = e.detail.value
    const staffMap = this.props.staff.staffMap
    let newStaffMap = JSON.parse(JSON.stringify(staffMap))
    newStaffMap[formData.name] = {
      rest: formData.rest,
      leave: formData.leave
    }
    this.props.updateStaffMap(newStaffMap)
    Taro.navigateBack({ delta: 1 })
  }

  render () {
    return (
      <View className='form-container'>
        <Form onSubmit={this.submit}>
          <View className='form-item'>
            <Text className='title'>姓名</Text>
            <Input className='item-input' name='name' autoFocus></Input>
          </View>
          
          <View className='form-item'>
            <Text className='title'>休息</Text>
            <Switch name='rest'></Switch>
          </View>
          
          <View className='form-item'>
            <Text className='title'>请假</Text>
            <Switch name='leave'></Switch>
          </View>

          <View className='form-btns'>
            <Button className='form-btn' type='primary' formType='submit'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}
