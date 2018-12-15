# time-to-work(该干活了)

一款随机分配工作的小工具。使用[Taro](https://taro.aotu.io)以及[taro-ui](http://taro-ui.aotu.io)编写。

目前暂时只有小程序版本，还没有做适配工作。

## 演示

微信小程序体验请扫码

![qr_code](./weapp-qr.jpg)

可以复制[模板内容（template.txt）](./template.txt)到粘贴板，进行一次性导入团队、岗位、人员信息。

**目前的工作模式是以岗位必须附属在一个团队里边的准则进行分配的，以后计划会添加设置对这个规则进行限制。**

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