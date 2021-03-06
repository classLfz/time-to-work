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
  entryEdit = (e) => {
    if (e.stopPropagation) e.stopPropagation()
    if (e.preventDefault) e.preventDefault()
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
    let i = 0
    const jobListCards = jobList.map(job => {
      let j = 0
      const cards = job.workers.map(worker => {
        return <Text className='worker-card' key={j++}>{worker}</Text>
      })
      return (
        <View key={i++} className='team-item'>
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
