import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard } from 'taro-ui'

import './teamCard.scss'

export default class TeamCard extends Component {
  constructor (props) {
    super(props)
  }

  /**
   * 进入编辑页面
   */
  entryEdit = () => {
    if (this.props.justShow) return
    Taro.navigateTo({
      url: `/pages/teamEdit/teamEdit?teamName=${this.props.teamData.name}`
    })
  }

  render () {
    const teamData = this.props.teamData || {}
    const jobMap = teamData.jobs || {}
    let jobList = []
    for (let job in jobMap) {
      jobList.push(Object.assign({name: job}, jobMap[job]))
    }
    const jobListCards = jobList.map(job => {
      const cards = job.workers.map(worker => {
        return <Text className='worker-card' key={worker}>{worker}</Text>
      })
      return (
        <View key={job.name} className='team-item'>
          <Text>{job.name}</Text>
          <Text> ({job.num}人)：</Text>
          {cards}
        </View>
      )
    })
    return (
      <View className='team-card-container' onClick={this.entryEdit}>
        <AtCard
          title={teamData.name}
          extra={teamData.leader}>
          {jobListCards}
        </AtCard>
      </View>
    )
  }
}
