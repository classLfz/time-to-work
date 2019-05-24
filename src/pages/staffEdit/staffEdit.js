import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Switch, Button } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'

import { connect } from '@tarojs/redux'
import { updateStaffMap } from '../../actions/staff'
import NavHeader from '../../components/navHeader/navHeader.js'

import './staffEdit.scss'

@connect(({ staff }) => ({
  staff
}), (dispatch) => ({
  onUpdateStaffMap (data) {
    dispatch(updateStaffMap(data))
  }
}))

export default class StaffEdit extends Component {
  config = {
    navigationBarTitleText: '编辑职员',
    navigationBarBackgroundColor: '#2196F3',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      name: '',
      rest: false,
      leave: false,
      multiple: false,
      multipleCount: 2
    }
  }

  handleMultipleChange (e) {
    this.setState({
      multiple: e.detail.value
    })
  }

  /**
   * 处理分配次数变化
   */
  handleMultipleCount (newCount) {
    this.setState({
      multipleCount: newCount
    })
  }

  componentWillMount () {
    // 从路由参数种获取职员信息
    this.setState({
      name: this.$router.params.name || '',
      rest: this.$router.params.rest === 'true',
      leave: this.$router.params.leave === 'true',
      multiple: this.$router.params.multiple === 'true',
      multipleCount: this.$router.params.multipleCount || 2
    })
  }
  /**
   * 提交表单
   * @param {Object} e 事件
   */
  submit = (e) => {
    const formData = e.detail.value
    const staffMap = this.props.staff.staffMap
    let newStaffMap = JSON.parse(JSON.stringify(staffMap))
    delete newStaffMap[this.state.name]
    newStaffMap[formData.name] = {
      rest: formData.rest,
      leave: formData.leave,
      multiple: formData.multiple,
      multipleCount: parseInt(this.state.multipleCount)
    }
    this.props.onUpdateStaffMap(newStaffMap)
    Taro.navigateBack({ delta: 1 })
  }
  /**
   * 删除职员
   */
  delete = () => {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该职员吗？',
      success: (res) => {
        if (res.confirm) {
          const name = this.state.name
          let newStaffMap = JSON.parse(JSON.stringify(this.props.staff.staffMap))
          delete newStaffMap[name]
          this.props.onUpdateStaffMap(newStaffMap)
          Taro.navigateBack({ delta: 1 })
        }
      }
    })
  }

  render () {
    const name = this.state.name
    const rest = this.state.rest
    const leave = this.state.leave
    const multiple = this.state.multiple
    const multipleCount = this.state.multipleCount
    const title = '编辑人员信息'

    const mulCountView = multiple ? (
      <View className='form-item'>
        <Text className='title'>最大分配次数</Text>
        <AtInputNumber
          min={2}
          step={1}
          value={multipleCount}
          onChange={this.handleMultipleCount}
        />
      </View>
    ) : ('')
    return (
      <View className='form-container'>
        {process.env.TARO_ENV === 'h5' ? (<NavHeader title={title} />) : ''}
        <Form onSubmit={this.submit}>
          <View className='form-item'>
            <Text className='title'>姓名</Text>
            <Input className='item-input' name='name' value={name} autoFocus></Input>
          </View>
          
          <View className='form-item'>
            <Text className='title'>休息</Text>
            <Switch name='rest' checked={rest}></Switch>
          </View>
          
          <View className='form-item'>
            <Text className='title'>请假</Text>
            <Switch name='leave' checked={leave}></Switch>
          </View>

          <View className='form-item'>
            <Text className='title'>多次分配</Text>
            <Switch name='multiple' checked={multiple} onChange={this.handleMultipleChange}></Switch>
          </View>

          {mulCountView}

          <View className='form-btns'>
            <Button type='warn' className='form-btn' onClick={this.delete}>删除</Button>
            <Button type='primary' className='form-btn' formType='submit'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}