import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Switch } from '@tarojs/components'
import { AtTag, AtIcon, AtFloatLayout, AtInputNumber } from 'taro-ui'
import { connect } from '@tarojs/redux'

import './jobCard.scss'

@connect(({ staff }) => ({
  staff
}))

export default class JobCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      workerPicking: false,
      jobName: '',
      jobData: {}
    }
  }
  /**
   * 页面挂载前，根据props赋值state
   */
  componentWillMount () {
    const jobName = this.props.jobName || ''
    const jobData = this.props.jobData || {}
    this.setState({
      jobName: jobName,
      jobData: jobData
    })
  }
  /**
   * 打开人员选择窗口
   */
  openWorkerPicking () {
    this.setState({
      workerPicking: true
    })
  }
  /**
   * 处理人员标签被点击事件，修改人员选择情况
   * @param {Object} e 点击事件
   */
  handleTagClick (e) {
    let newJobData = JSON.parse(JSON.stringify(this.state.jobData))
    let workers = new Set(newJobData.workers)
    if (e.active) {
      workers.add(e.name)
    } else {
      workers.delete(e.name)
    }
    newJobData.workers = [...workers]
    this.setState({
      jobData: newJobData
    })
    this.props.onJobChange({
      jobName: this.props.jobName,
      jobData: newJobData
    })
  }
  /**
   * 处理岗位名称输入事件，修改state的值
   * @param {Object} e 键盘输入事件
   */
  handleJobNameInput (e) {
    const newJobName = e.detail.value
    // if (!newJobName) return
    this.props.onJobChange({
      oldName: this.state.jobName,
      jobName: newJobName,
      jobData: this.props.jobData
    })
    this.setState({
      jobName: newJobName
    })
  }
  /**
   * 处理岗位人数发生变化
   * @param {Number} newJobNum 
   */
  handleJobNumInput (newJobNum) {
    let newJobData = JSON.parse(JSON.stringify(this.state.jobData))
    newJobData.num = newJobNum
    this.setState({
      jobData: newJobData
    })
    this.props.onJobChange({
      jobName: this.props.jobName,
      jobData: newJobData
    })
  }
  /**
   * 处理岗位是否参与分配发生变化
   * @param {Object} e 事件
   */
  handleJobRestChange (e) {
    const newRest = !e.detail.value
    let newJobData = JSON.parse(JSON.stringify(this.state.jobData))
    newJobData.rest = newRest
    this.setState({
      jobData: newJobData
    })
    this.props.onJobChange({
      jobName: this.props.jobName,
      jobData: newJobData
    })
  }
  /**
   * 删除岗位
   */
  delete () {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该岗位吗？',
      success: (res) => {
        if (res.confirm) {
          this.props.onJobChange({
            delete: this.state.jobName
          })
        }
      }
    })
  }

  render () {
    const jobName = this.state.jobName
    const jobData = this.state.jobData
    const workers = jobData.workers || []
    const workerList = workers.map(worker => {
      return (
        <Text className='worker-card' key={worker} name={staff}>{worker}</Text>
      )
    })
    const staffMap = this.props.staff.staffMap || {}
    const staffList = Object.keys(staffMap).map(staff => {
      return (
        <View className='tag' key={staff}>
          <AtTag
            className='tag'
            name={staff}
            active={workers.includes(staff)}
            onClick={this.handleTagClick.bind(this)}>
            {staff}
          </AtTag>
        </View>
      )
    })
    return (
      <View className='card-container'>
        <View>
          <View className='operator-btn' onClick={this.delete}>
            <AtIcon
              value='subtract-circle'
              size='24'
              color='#ed4014'>
            </AtIcon>
          </View>
        </View>
        <View className='job-item'>
          <Text className='title'>职位名称</Text>
          <Input
            className='item-input'
            name='jobName' value={jobName}
            placeholder='请输入职位名称'
            onBlur={this.handleJobNameInput} />
        </View>

        <View className='job-item'>
          <Text className='title'>职位人数</Text>
          <AtInputNumber
            min={0}
            step={1}
            value={jobData.num}
            onChange={this.handleJobNumInput}
          />
        </View>

        <View className='job-item'>
          <Text className='title'>职位参与分配</Text>
          <Switch checked={!jobData.rest} onChange={this.handleJobRestChange} />
        </View>

        <View className='job-item' onClick={this.openWorkerPicking}>
          <Text className='title'>指定人员</Text>
          <View>{workerList}</View>
        </View>

        <AtFloatLayout
          isOpened={this.state.workerPicking}
          title='选择指定人员'>
          <View>
            {staffList}
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
