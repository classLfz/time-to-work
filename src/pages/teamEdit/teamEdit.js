import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Picker, Switch, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import JobCard from '../../components/jobCard/jobCard.js'

import { connect } from '@tarojs/redux'
import { updateTeamMap } from '../../actions/team'
import { naturalSort } from '../../utils'

import './teamEdit.scss'

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  updateTeamMap (data) {
    dispatch(updateTeamMap(data))
  }
}))

export default class TeamEdit extends Component {
  config = {
    navigationBarTitleText: '编辑团队',
    navigationBarBackgroundColor: '#00897B',
    navigationBarTextStyle: 'white'
  }

  constructor (props) {
    super(props)
    this.state = {
      originalTeamName: '',
      teamName: '',
      teamData: {},
      staffNameList: [],
      leaderSelected: 0,
      addJob: false
    }
  }

  componentWillMount () {
    const staffMap = this.props.staff.staffMap || {}
    const teamName = this.$router.params.teamName || ''
    const teamData = this.props.team.teamMap[teamName]
    const leader = teamData.leader
    let staffNameList = Object.keys(staffMap)
    this.setState({
      originalTeamName: teamName,
      teamName: teamName,
      teamData: teamData,
      staffNameList: staffNameList,
      leaderSelected: staffNameList.indexOf(leader)
    })
  }
  /**
   * 展示岗位名称输入框
   */
  showAddJob () {
    this.setState({
      addJob: true
    })
  }
  /**
   * 处理岗位的修改
   * @param {Object} e 事件
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
   * 添加岗位
   * @param {Object} blur事件
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
        teamData: {}
      })
      setTimeout(() => {
        this.setState({
          teamData: newTeamData
        })
      }, 100)
    }
    this.setState({
      addJob: false
    })
  }
  /**
   * 处理负责人的选择
   */
  handleLeaderPick (e) {
    this.setState({
      leaderSelected: e.detail.value
    })
  }
  /**
   * 提交表单
   * @param {Object} 事件
   */
  submit (e) {
    const formData = e.detail.value
    let newTeamMap = JSON.parse(JSON.stringify(this.props.team.teamMap))
    if (formData.name !== this.state.teamName) {
      delete newTeamMap[this.state.teamName]
    }
    newTeamMap[formData.name] = {
      name: formData.name,
      rest: !formData.rest,
      leader: this.state.staffNameList[this.state.leaderSelected],
      jobs: this.state.teamData.jobs,
      workers: {}
    }
    this.props.updateTeamMap(newTeamMap)
    Taro.navigateBack({ delta: 1 })
  }
  /**
   * 删除该团队
   */
  delete () {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该团队吗？',
      success: (res) => {
        if (res.confirm) {
          const teamName = this.state.originalTeamName
          let newTeamMap = JSON.parse(JSON.stringify(this.props.team.teamMap))
          delete newTeamMap[teamName]
          this.props.updateTeamMap(newTeamMap)
          Taro.navigateBack({ delta: 1 })
        }
      }
    })
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
            <Input className='item-input' name='name' value={teamData.name} placeholder='输入团队名称' autoFocus></Input>
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
            <Button type='warn' className='form-btn' onClick={this.delete}>删除</Button>
            <Button type='primary' formType='submit' className='form-btn'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}