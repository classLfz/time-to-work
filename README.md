# time-to-work(分配工作)

一款随机分配工作的小工具。使用[Taro](https://taro.aotu.io)以及[taro-ui](http://taro-ui.aotu.io)编写。


## 关于兼容

由于代码已经写了听多了，调研了一下 RN 的样式兼容方案，还是有点吃力。所以，我本人决定还是放弃兼容 `React-Native` 端的兼容了。

## 演示

### weapp

微信小程序体验请扫码

![qr_code](./weapp-qr.jpg)

### h5

[进入链接](https://classlfz.github.io/time-to-work)(使用移动端设备预览效果最佳)

## 一次性导入

可以复制[模板内容（template.txt）](./template.txt)到粘贴板，进行一次性导入团队、岗位、人员信息。

![demo](./demo.gif)

## 开发

```sh
# 安装全局依赖
$ npm i -g taro

# 安装依赖
$ yarn

# 小程序调试
$ yarn dev:weapp

# 小程序打包
$ yarn build:weapp
```

## 开发注意事项

- 组件js文件内函数，除 `constructor`, `render` 以及一些生命周期函数外，其他的函数最好时候箭头函数的方式命名，以兼容h5；