import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Picker, Switch, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import JobCard from '../../components/jobCard/jobCard.js'

import { connect } from '@tarojs/redux'
import { updateTeamMap } from '../../actions/team'
import { naturalSort } from '../../utils'

import './teamCreate.scss'

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  updateTeamMap (data) {
    dispatch(updateTeamMap(data))
  }
}))

export default class TeamCreate extends Component {
  config = {
    navigationBarTitleText: '添加团队',
    navigationBarBackgroundColor: '#00897B',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      teamData: {
        name: '',
        leader: '',
        rest: false,
        workers: [],
        jobs: {}
      },
      staffNameList: [],
      leaderSelected: -1,
      addJob: false
    }
  }

  componentWillMount () {
    const staffMap = this.props.staff.staffMap || {}
    let staffNameList = Object.keys(staffMap)
    this.setState({
      staffNameList: staffNameList
    })
  }
  /**
   * 展示添加岗位输入框
   */
  showAddJob () {
    this.setState({
      addJob: true
    })
  }
  /**
   * 添加岗位
   * @param {Object} e 键盘事件
   */
  addJob (e) {
    const newJobName = e.detail.value || ''
    if (newJobName) {
      let newTeamData = JSON.parse(JSON.stringify(this.state.teamData))
      newTeamData.jobs[newJobName] = {
        num: 1,
        rest: false,
        workers: []
      }
      this.setState({
        teamData: newTeamData
      })
    }
    this.setState({
      addJob: false
    })
  }
  /**
   * 处理负责人选择发生变化
   * @param {Object} e 事件
   */
  handleLeaderPick (e) {
    this.setState({
      leaderSelected: e.detail.value
    })
  }
  /**
   * 处理岗位信息发生变化
   * @param {Object} e  事件
   */
  handleJobChange (e) {
    let newTeamData = JSON.parse(JSON.stringify(this.state.teamData))
    if (e.delete) {
      delete newTeamData.jobs[e.delete]
    }
    if (e.oldName) {
      delete newTeamData.jobs[e.oldName]
    }
    if (e.jobName && e.jobData) {
      newTeamData.jobs[e.jobName] = e.jobData
    }
    this.setState({
      teamData: newTeamData
    })
  }
  /**
   * 提交表单，创建团队
   * @param {Object} e 事件
   */
  submit (e) {
    const formData = e.detail.value
    let newTeamMap = JSON.parse(JSON.stringify(this.props.team.teamMap))
    if (!formData.name.trim()) {
      Taro.showToast({
        title: '团队名称不能为空',
        icon: 'none'
      })
      return
    }
    newTeamMap[formData.name] = {
      name: formData.name,
      rest: !formData.rest,
      leader: this.state.staffNameList[this.state.leaderSelected],
      jobs: this.state.jobs,
      workers: []
    }
    this.props.updateTeamMap(newTeamMap)
    Taro.navigateBack({ delta: 1 })
  }

  render () {
    const staffNameList = this.state.staffNameList || []
    const leader = staffNameList[this.state.leaderSelected]
    const teamData = this.state.teamData || {}
    const jobs = teamData.jobs || {}
    const jobListCards = Object.keys(jobs).sort(naturalSort).map(job => {
      return (
        <JobCard
          key={job}
          jobName={job}
          jobData={jobs[job]}
          onJobChange={this.handleJobChange} />
      )
    })
    let addJobCard = null
    if (this.state.addJob) {
      addJobCard = (
        <View className='add-job-container'>
          <Text>新建岗位名称</Text>
          <Input placeholder='请输入名称' autoFocus onBlur={this.addJob} />
        </View>
      )
    } else {
      addJobCard = ''
    }
    return (
      <View className='form-container'>
        <Form onSubmit={this.submit}>
          <View className='form-item'>
            <Text className='title'>团队名称</Text>
            <Input className='item-input' name='name' placeholder='输入团队名称' autoFocus></Input>
          </View>

          <Picker mode='selector' range={staffNameList} onChange={this.handleLeaderPick}>
            <View className='form-item'>
              <Text className='title'>负责人</Text>
              <Text className='content'>{leader}</Text>
            </View>
          </Picker>

          <View className='form-item'>
            <Text className='title'>是否参与分配</Text>
            <Switch name='rest' checked={!teamData.rest} />
          </View>

          <View className='job-list'>
            <View className='title'>
              <Text>岗位列表</Text>
              <View className='icon-btn' onClick={this.showAddJob}>
                <AtIcon
                  value='add-circle'
                  size='24'
                  color='#19be6b'></AtIcon>
              </View>
            </View>

            {addJobCard}

            {jobListCards}
          </View>

          <View className='form-btns'>
            <Button type='primary' formType='submit' className='form-btn'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}
