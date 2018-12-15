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
      cheatWorkerPicking: false,
      cheatClickCount: 0
    }
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
    let newJobData = JSON.parse(JSON.stringify(this.props.jobData))
    let workers = new Set(newJobData.workers)
    if (!e.active) {
      workers.add(e.name)
    } else {
      workers.delete(e.name)
    }
    newJobData.workers = [...workers]
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
    this.props.onJobChange({
      oldName: this.props.jobName,
      jobName: newJobName,
      jobData: this.props.jobData
    })
  }
  /**
   * 处理岗位人数发生变化
   * @param {Number} newJobNum 
   */
  handleJobNumInput (newJobNum) {
    let newJobData = JSON.parse(JSON.stringify(this.props.jobData))
    newJobData.num = newJobNum
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
    let newJobData = JSON.parse(JSON.stringify(this.props.jobData))
    newJobData.rest = newRest
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
            deleteKey: this.props.jobName
          })
        }
      }
    })
  }
  /**
   * 打开作弊选择人员窗口
   */
  openCheatSelector (e) {
    e.stopPropagation()
    let cheatClickCount = this.state.cheatClickCount
    if (cheatClickCount > 7) {
      this.setState({
        cheatClickCount: 0,
        cheatWorkerPicking: true
      })
    } else {
      this.setState({
        cheatClickCount: cheatClickCount + 1,
        cheatWorkerPicking: false
      })
    }
  }
  /**
   * 处理作弊人员标签被点击事件，秘密修改人员选择情况
   * @param {Object} e 点击事件
   */
  handleCheatTagClick (e) {
    let newJobData = JSON.parse(JSON.stringify(this.props.jobData))
    let cheatWorkers = new Set(newJobData.cheatWorkers || [])
    if (!e.active) {
      cheatWorkers.add(e.name)
    } else {
      cheatWorkers.delete(e.name)
    }
    newJobData.cheatWorkers = [...cheatWorkers]
    this.props.onJobChange({
      jobName: this.props.jobName,
      jobData: newJobData
    })
  }
  handlePickingClose () {
    this.setState({
      workerPicking: false
    })
  }
  handleCheatClose () {
    this.setState({
      cheatWorkerPicking: false
    })
  }

  render () {
    const jobName = this.props.jobName
    const jobData = this.props.jobData
    const workers = jobData.workers || []
    const cheatWorkers = jobData.cheatWorkers || []
    const workerList = workers.map(worker => {
      return (
        <Text className='worker-card' key={worker} name={worker}>{worker}</Text>
      )
    })
    const staffMap = this.props.staff ? this.props.staff.staffMap : {}
    // 人员名单列表视图
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
    // 作弊人员名单列表视图
    const cheatStaffList = Object.keys(staffMap).map(staff => {
      return (
        <View className='tag' key={staff}>
          <AtTag
            className='tag'
            name={staff}
            active={cheatWorkers.includes(staff)}
            onClick={this.handleCheatTagClick.bind(this)}>
            {staff}
          </AtTag>
        </View>
      )
    })
    return (
      <View className='card-container'>
        <View className='card-header'>
          <View className='operator-btn' onClick={this.delete}>
            <AtIcon
              value='subtract-circle'
              size='24'
              color='#ed4014'>
            </AtIcon>
          </View>

          <View className='cheat-btn' onClick={this.openCheatSelector}></View>
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
          title='选择指定人员'
          onClose={this.handlePickingClose}>
          <View>
            {staffList}
          </View>
        </AtFloatLayout>

        <AtFloatLayout
          isOpened={this.state.cheatWorkerPicking}
          title='秘密选择指定人员'
          onClose={this.handleCheatClose}>
          <View>
            {cheatStaffList}
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
