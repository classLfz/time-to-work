import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Picker, Switch, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'

import JobCard from '../../components/jobCard/jobCard.js'
import NavHeader from '../../components/navHeader/navHeader.js'
import { updateTeamMap } from '../../actions/team'
import { naturalSort } from '../../utils'

import './teamEdit.scss'

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  onUpdateTeamMap (data) {
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
      leaderWork: true,
      leaderSelected: 0,
      addJob: false
    }
  }

  componentWillMount () {
    const staffMap = this.props.staff.staffMap || {}
    const teamName = this.$router.params.teamName || ''
    const teamData = this.props.team.teamMap[teamName]
    const leaderWork = teamData.leaderWork
    const leader = teamData.leader
    let staffNameList = Object.keys(staffMap)
    this.setState({
      originalTeamName: teamName,
      teamName: teamName,
      teamData: teamData,
      staffNameList: staffNameList,
      leaderWork: leaderWork,
      leaderSelected: staffNameList.indexOf(leader)
    })
  }
  /**
   * 展示岗位名称输入框
   */
  showAddJob = () => {
    this.setState({
      addJob: true
    })
  }
  /**
   * 处理岗位的修改
   * @param {Object} e 事件
   */
  handleJobChange = (e) => {
    let newTeamData = JSON.parse(JSON.stringify(this.state.teamData))
    if (e.deleteKey) {
      delete newTeamData.jobs[e.deleteKey]
    }
    if (e.oldName) {
      delete newTeamData.jobs[e.oldName]
    }
    if (e.jobName && e.jobData) {
      delete newTeamData.jobs[e.jobName]
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
  addJob = (e) => {
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
   * 处理是否需要负责人发生变化
   * @param {Object} e 改变事件信息
   */
  needLeaderChange = () => {
    let newTeamData = JSON.parse(JSON.stringify(this.state.teamData))
    newTeamData.needLeader = !newTeamData.needLeader
    this.setState({
      teamData: newTeamData
    })
  }
  /**
   * 处理负责人的选择
   */
  handleLeaderPick = (e) => {
    this.setState({
      leaderSelected: e.detail.value
    })
  }
  /**
   * 提交表单
   * @param {Object} 事件
   */
  submit = (e) => {
    const formData = e.detail.value
    let newTeamMap = JSON.parse(JSON.stringify(this.props.team.teamMap))
    if (formData.name !== this.state.teamName) {
      delete newTeamMap[this.state.teamName]
    }
    newTeamMap[formData.name] = {
      name: formData.name,
      rest: !formData.rest,
      needLeader: formData.needLeader,
      leaderWork: formData.leaderWork,
      leader: this.state.staffNameList[this.state.leaderSelected],
      jobs: this.state.teamData.jobs,
      workers: {}
    }
    if (!newTeamMap[formData.name].needLeader) {
      newTeamMap[formData.name].leader = ''
    }
    this.props.onUpdateTeamMap(newTeamMap)
    Taro.navigateBack({ delta: 1 })
  }
  /**
   * 删除该团队
   */
  delete = () => {
    Taro.showModal({
      title: '操作不可逆',
      content: '确定要删除该团队吗？',
      success: (res) => {
        if (res.confirm) {
          const teamName = this.state.originalTeamName
          let newTeamMap = JSON.parse(JSON.stringify(this.props.team.teamMap))
          delete newTeamMap[teamName]
          this.props.onUpdateTeamMap(newTeamMap)
          Taro.navigateBack({ delta: 1 })
        }
      }
    })
  }

  render () {
    const jobNameInputPlaceholder = '请输入名称'
    const teamNameInputPlaceholder = '请输入团队名称'
    const staffNameListArr = this.state.staffNameList || []
    let leader = null
    let leaderSelector = null
    if (this.state.teamData.needLeader) {
      leader = staffNameListArr[this.state.leaderSelected] || ''
      leaderSelector = (
        <View>
          <View className='form-item'>
            <Text className='title'>负责人参与岗位分配</Text>
            <Switch name='leaderWork' checked={this.state.leaderWork} />
          </View>

          <Picker mode='selector' range={staffNameListArr} onChange={this.handleLeaderPick}>
            <View className='form-item'>
              <Text className='title'>负责人</Text>
              <Text className='content'>{leader}</Text>
            </View>
          </Picker>
        </View>
      )
    } else {
      leader = ''
      leaderSelector = ''
    }
    const teamDataObj = this.state.teamData || {}
    const jobs = teamDataObj.jobs || {}
    const staff = this.props.staff
    const jobListCards = Object.keys(jobs).sort(naturalSort).map(job => {
      return (
        <JobCard
          key={job}
          jobName={job}
          jobData={jobs[job]}
          staff={staff}
          onJobChange={this.handleJobChange} />
      )
    })
    let addJobCard = null
    if (this.state.addJob) {
      addJobCard = (
        <View className='add-job-container'>
          <Text>新建岗位名称</Text>
          <Input className='item-input' placeholder={jobNameInputPlaceholder} autoFocus onBlur={this.addJob} />
        </View>
      )
    } else {
      addJobCard = ''
    }
    const title = '编辑团队信息'
    return (
      <View className='form-container'>
        {process.env.TARO_ENV === 'h5' ? (<NavHeader title={title} />) : ''}
        <Form onSubmit={this.submit}>
          <View className='form-item'>
            <Text className='title'>团队名称</Text>
            <Input className='item-input' name='name' value={teamDataObj.name} placeholder={teamNameInputPlaceholder} autoFocus></Input>
          </View>

          <View className='form-item'>
            <Text className='title'>是否需要负责人</Text>
            <Switch name='needLeader' checked={teamDataObj.needLeader} onChange={this.needLeaderChange} />
          </View>

          {leaderSelector}

          <View className='form-item'>
            <Text className='title'>是否参与分配</Text>
            <Switch name='rest' checked={!teamDataObj.rest} />
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