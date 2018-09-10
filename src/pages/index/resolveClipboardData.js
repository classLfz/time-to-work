/**
 * 对粘贴板的内容进行解析，添加团队，岗位，职员信息
 * @param {String} data 粘贴板信息
 * @param {Object} teamMap 已有团队信息
 * @param {Object} staffMap 已有职员信息
 * @return {Array} [teamMap, staffMap] 新的团队信息，新的职员信息
 */
export default function resolveClipboardData (data, teamMap = {}, staffMap = {}) {
  if (/^该干活了[(|（]清空[)|）]/.test(data)) {
    teamMap = {}
    staffMap = {}
  }
  let teams = data.split(/\s#/)
  for (let i = 1; i < teams.length; i++) {
    let items = teams[i].trim().split(/\n|\r/)
    let newTeam = {jobs: {}, workers: {}}
    items.forEach(item => {
      let specific = item.split(/:|：/)
      if (!specific || specific.length <= 1) return
      switch (specific[0].replace(/:|：/, '')) {
        case '团队':
          newTeam.name = specific[1]
          break

        case '负责人':
          newTeam.leader = specific[1]
          staffMap[specific[1]] = {
            rest: false,
            leave: false
          }
          break

        case '职位':
          let arr = specific[1].split(/\*/)
          let workers = {}
          let workerList = []
          arr.splice(2).forEach(item => {
            workers[item.trim()] = {
              rest: false,
              leave: false
            }
            workerList.push(item.trim())
          })
          newTeam.jobs[arr[0].trim()] = {
            num: parseInt(arr[1].trim()),
            rest: false,
            workers: workerList
          }
          staffMap = Object.assign(staffMap, workers)
          break
      }
    })
    teamMap[newTeam.name] = newTeam
  }
  let staffStr = data.split(/\@人员[:|：]/)[1] || ''
  if (!staffStr) {
    return [teamMap, staffMap]
  }
  let staff = staffStr.split(/[,|，]/)
  staff.forEach(name => {
    staffMap[name.trim()] = {
      rest: false,
      leave: false
    }
  })
  return [teamMap, staffMap]
}