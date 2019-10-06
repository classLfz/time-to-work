import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Switch, Button } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'

import { connect } from '@tarojs/redux'
import { updateStaffMap, updateStaffGroup } from '../../actions/staff'
import NavHeader from '../../components/navHeader/navHeader.js'

import './staffEditor.scss'

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

export default class StaffEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      edit: false,
      name: '',
      rest: false,
      leave: false,
      multiple: false,
      multipleCount: 2
    }
  }

  componentWillMount () {
    // 从路由参数种获取职员信息
    const { name, rest, leave, multiple, multipleCount } = this.$router.params
    this.setState({
      edit: !!name,
      name: name || '',
      rest: rest === 'true',
      leave: leave === 'true',
      multiple: multiple === 'true',
      multipleCount: multipleCount || 2
    })
    Taro.setNavigationBarTitle({
      title: !!name ? '编辑职员' : '添加职员'
    })
  }

  config = {
    navigationBarTitleText: '编辑职员',
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
   * 提交表单
   * @param {Object} e 事件
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
    const { staffMap, staffGroup } = this.props.staff
    let newStaffMap = JSON.parse(JSON.stringify(staffMap))
    const { edit, name } = this.state
    if (edit) {
      delete newStaffMap[name]
      if (Object.keys(newStaffMap).filter(item => item === newName).length > 0) {
        Taro.showToast({
          title: '同名人员已存在，请检查',
          icon: 'none'
        })
        return
      }
      if (name !== newName) {
        for (let key in staffGroup) {
          for (let i = 0; i < staffGroup[key].staffs.length; i++) {
            if (staffGroup[key].staffs[i] === name) staffGroup[key].staffs[i] = newName
          }
        }
        this.props.onUpdateStaffGroup(staffGroup)
      }
    } else {
      if (newStaffMap[newName]) {
        Taro.showToast({
          title: '同名人员已存在，请检查',
          icon: 'none'
        })
        return
      }
    }
    newStaffMap[newName] = {
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
            <Button type='warn' className='form-btn' onClick={this.delete}>删除</Button>
            <Button type='primary' className='form-btn' formType='submit'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}