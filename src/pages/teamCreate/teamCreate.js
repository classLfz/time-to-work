import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input, Picker, Switch, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import JobCard from '../../components/jobCard/jobCard.js'

import { connect } from '@tarojs/redux'
import { updateTeamMap } from '../../actions/team'
import { naturalSort } from '../../utils'

switch (process.env.TARO_ENV) {
  case 'weapp':
    require('./teamCreate.scss')
    break

  case 'h5':
    require('./teamCreate-h5.scss')
    break
}

@connect(({ team, staff }) => ({
  team,
  staff
}), (dispatch) => ({
  onUpdateTeamMap (data) {
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
      needLeader: false,
      leaderWork: true,
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
        workers: [],
        cheatWorkers: []
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
   * 处理是否需要负责人发生变化
   * @param {Object} e 改变事件信息
   */
  needLeaderChange (e) {
    this.setState({
      needLeader: e.detail.value
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
    if (e.deleteKey) {
      delete newTeamData.jobs[e.deleteKey]
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
      needLeader: this.state.needLeader,
      leaderWork: this.state.leaderWork,
      leader: this.state.staffNameList[this.state.leaderSelected],
      jobs: this.state.jobs,
      workers: []
    }
    if (!this.state.needLeader) {
      newTeamMap[formData.name].leader = ''
    }
    this.props.onUpdateTeamMap(newTeamMap)
    Taro.navigateBack({ delta: 1 })
  }

  render () {
    const staffNameListArr = this.state.staffNameList || []
    let leader = null
    let leaderSelector = null
    if (this.state.needLeader) {
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
    }
    const teamDataObj = this.state.teamData || {}
    const jobs = teamDataObj.jobs || {}
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
    const h5Header = (
      <View className='team-create-header'>
        <View>
          <AtIcon value='chevron-left' size='24' color='#FFFFFF'></AtIcon>
        </View>
        <View className='title'>添加团队信息</View>
        <View> </View>
      </View>
    )
    return (
      <View className='team-create-form-container'>
        {process.env.TARO_ENV === 'h5' ? h5Header : ''}
        <Form className='from-container' onSubmit={this.submit}>
          <View className='form-item'>
            <Text className='title'>团队名称</Text>
            <Input className='item-input' name='name' placeholder='输入团队名称' autoFocus></Input>
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
            <Button type='primary' formType='submit' className='form-btn'>提交</Button>
          </View>
        </Form>
      </View>
    )
  }
}
