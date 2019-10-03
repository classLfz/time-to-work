import Taro, { Component } from '@tarojs/taro'
import { View, Button, Form, Text, Switch, Input } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'

import { connect } from '@tarojs/redux'
import { updateStaffMap } from '../../actions/staff'
import NavHeader from '../../components/navHeader/navHeader.js'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./staffCreate.scss')
    break

  case 'h5':
    require('./staffCreate-h5.scss')
    break
}

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class StaffCreate extends Component {
  constructor (props) {
    super (props)
    this.state = {
      multiple: false,
      multipleCount: 2
    }
  }

  config = {
    navigationBarTitleText: '增加职员',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }
  
  /**
   * 处理是否多次分配发生变化
   * @param {Object} e 变化事件
   */
  handleMultipleChange (e) {
    this.setState({
      multiple: e.detail.value
    })
  }

  /**
   * 处理分配次数变化
   * @param {String} newCount 次数
   */
  handleMultipleCount (newCount) {
    this.setState({
      multipleCount: parseInt(newCount)
    })
  }

  /**
   * 提交表单，创建职员
   * @param {Object} e 点击事件
   */
  submit = (e) => {
    const formData = e.detail.value
    const newName = formData.name.trim()
    if (!newName) {
      Taro.showToast({
        title: '人员名称不能为空',
        icon: 'none'
      })
      return
    }
    const staffMap = this.props.staff.staffMap
    let newStaffMap = JSON.parse(JSON.stringify(staffMap))
    if (newStaffMap[newName]) {
      Taro.showToast({
        title: '同名人员已存在，请检查',
        icon: 'none'
      })
      return
    }
    newStaffMap[newName] = {
      rest: formData.rest,
      leave: formData.leave,
      multiple: this.state.multiple,
      multipleCount: this.state.multipleCount
    }
    this.props.onUpdateStaffMap(newStaffMap)
    Taro.navigateBack({ delta: 1 })
  }

  render () {
    const multiple = this.state.multiple
    const multipleCount = this.state.multipleCount
    const title = '添加人员信息'
    return (
      <View className='form-container'>
        {process.env.TARO_ENV === 'h5' ? (<NavHeader title={title} />) : ''}
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

          <View className='form-item'>
            <Text className='title'>多次分配</Text>
            <Switch name='multiple' checked={multiple} onChange={this.handleMultipleChange}></Switch>
          </View>

          <View className='form-item' hidden={!multiple}>
            <Text className='title'>最大分配次数</Text>
            <AtInputNumber
              min={2}
              step={1}
              value={multipleCount}
              onChange={this.handleMultipleCount}
            />
          </View>

          <View className='form-btns'>
            <Button className='form-btn' type='primary' formType='submit'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}
