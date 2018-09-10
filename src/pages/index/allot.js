export default function (teamMap, staffMap) {
  if (Object.keys(teamMap).length === 0) {
    return {
      type: 'error',
      message: '请先添加团队'
    }
  }
  // 去除休息or请假人员
  for (let staff in staffMap) {
    if (staffMap[staff].rest || staffMap[staff].leave) {
      delete staffMap[staff]
    }
  }
  if (Object.keys(staffMap).length === 0) {
    return {
      type: 'error',
      message: '暂无职员可以分配'
    }
  }
  // 去除指定人员
  for (let team in teamMap) {
    // 团队不分配，人员需要参与其他分配
    if (teamMap[team].rest) continue
    // 去除负责人
    delete staffMap[teamMap[team].leader]
    let jobs = teamMap[team].jobs
    for (let job in jobs) {
      // 去除已经指定工作的人员
      jobs[job].workers.forEach(worker => {
        delete staffMap[worker]
      })
    }
  }
  for (let team in teamMap) {
    if (!teamMap[team].leader) {
      let staffKeys = Object.keys(staffMap)
      let index = parseInt(Math.random() * staffKeys.length)
      teamMap[team].leader = staffKeys[index]
      delete staffMap[staffKeys[index]]
    }
    let jobs = teamMap[team].jobs
    // 团队不做分配
    if (teamMap[team].rest) continue
    for (let job in jobs) {
      // 职位休息or人员达标
      if (jobs[job].rest || jobs[job].num <= jobs[job].workers.length) continue
      while (jobs[job].num > jobs[job].workers.length) {
        let staffKeys = Object.keys(staffMap)
        if (staffKeys.length <= 0) break
        let index = parseInt(Math.random() * staffKeys.length)
        if (staffKeys[index]) {
          jobs[job].workers.push(staffKeys[index])
          delete staffMap[staffKeys[index]]
        }
      }
    }
  }
  // 删除不参与分配的团队信息，不进行展示
  for (let team in teamMap) {
    if (teamMap[team].rest) {
      delete teamMap[team]
    }
  }
  return {
    type: 'success',
    teamMap
  }
}