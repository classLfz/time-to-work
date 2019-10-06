import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 给Object添加长度判断函数
Object.size = function(obj) {
  var size = 0, key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++
  }
  return size
}

const store = configStore()

class App extends Component {
  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      const updateManager = Taro.getUpdateManager()
      // 检查更新
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          Taro.showToast({
            title: '发现新版本',
            icon: 'none'
          })
        }
      })
      // 有新的版本可以更新
      updateManager.onUpdateReady(function () {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      // 下载更新失败
      updateManager.onUpdateFailed(function () {
        Taro.showToast({
          title: '更新失败，请检查网络',
          icon: 'none'
        })
      })
    }
    
    try {
      // 检查储存容量，并作出处理
      let info = Taro.getStorageInfoSync()
      if (process.env.TARO_ENV === 'weapp' && (info.limitSize - info.currentSize) < 240) {
        Taro.showToast({
          title: '储存容量过大，正在为您清除',
          icon: 'none'
        })
        let history = Taro.getStorageInfoSync('history')
        let historyKeys = Object.keys(history).sort((i1, i2) => {
          return parseInt(i1) - parseInt(i2)
        })
        let count = 100
        for (let i = 0; i < count && i < historyKeys.length; i++) {
          delete history[historyKeys[i]]
        }
        Taro.setStorageSync('history', history)
      } else if (process.env.TARO_ENV === 'h5') {
        let history = Taro.getStorageInfoSync('history')
        let historyKeys = Object.keys(history).sort((i1, i2) => {
          return parseInt(i1) - parseInt(i2)
        })
        if (historyKeys.length > 400) {
          Taro.showToast({
            title: '储存容量过大，正在为您清除',
            icon: 'none'
          })
          let count = 100
          for (let i = 0; i < count && i < historyKeys.length; i++) {
            delete history[historyKeys[i]]
          }
          Taro.setStorageSync('history', history)
        }
      }
    } catch (e) {
      Taro.showToast({
        title: '清除存储容量出错',
        icon: 'none'
      })
    }

    // h5纠正路由
    if (process.env.TARO_ENV === 'h5') {
      if (window.location.hash !== '#/pages/index/index') {
        window.location = '#/pages/index/index'
      }
    }
  }

  config = {
    pages: [
      'pages/index/index',
      'pages/team/team',
      'pages/teamEdit/teamEdit',
      'pages/teamCreate/teamCreate',
      'pages/teamSort/teamSort',
      'pages/staff/staff',
      'pages/staffEdit/staffEdit',
      'pages/staffCreate/staffCreate',
      'pages/staffGroup/staffGroup',
      'pages/staffGroupEditor/staffGroupEditor',
      'pages/history/history',
      'pages/historyDetail/historyDetail',
      'pages/setting/setting'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: '#1296db',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '分配',
          iconPath: 'images/allocation_gray.png',
          selectedIconPath: 'images/allocation_blue.png'
        },
        {
          pagePath: 'pages/team/team',
          text: '岗位',
          iconPath: 'images/job_gray.png',
          selectedIconPath: 'images/job_blue.png'
        },
        {
          pagePath: 'pages/staff/staff',
          text: '职员',
          iconPath: 'images/people_gray.png',
          selectedIconPath: 'images/people_blue.png'
        },
        {
          pagePath: 'pages/setting/setting',
          text: '设置',
          iconPath: 'images/setting_gray.png',
          selectedIconPath: 'images/setting_blue.png'
        }
      ]
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
