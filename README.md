<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [mp-uni-cli](#mp-uni-cli)
  - [1.背景](#1背景)
  - [2.功能](#2功能)
  - [3.如何安装使用](#3如何安装使用)
    - [3.1.安装](#31安装)
    - [3.2.使用](#32使用)
  - [4.使用方项目适配](#4使用方项目适配)
    - [4.1.cli 配置文件](#41cli-配置文件)
      - [4.1.1.第三方平台项目](#411第三方平台项目)
      - [4.1.2.微信mp平台项目](#412微信mp平台项目)
    - [4.2.项目切换环境](#42项目切换环境)
      - [4.2.1.业务域名](#421业务域名)
      - [4.2.2.scss 环境变量切换](#422scss-环境变量切换)
  - [5.Q&A](#5qa)
  - [6.TODO](#6todo)

# mp-uni-cli

![example](https://t.focus-res.cn/front-end/mp-uni-cli/example.gif)

## 1.背景

在当前开发组内小程序时，提测或者上线时存在以下痛点：

- 每次都得手动切换环境来更换业务域名以及 scss 里的环境变量

- 因为大部分项目都是基于第三方平台提审发布，所以一个项目可能对应多个小程序。以集团营销跟客助手为例，正式环境一个，第三方平台绑定的开发小程序 dev 和线上各两个，打包后提交代码，测试时推到第三方平台 dev 开发小程序并要部署体验版、线上回测时推到第三方平台线上开发小程序并要部署体验版、提审发布时要从模版库分发到正式环境小程序，这个过程至少要切换三次 appid。

- 发布时会调很多第三方平台的接口进行提审发布。

**很麻烦，容易出错。**当前 cli 工具是针对以上痛点，做了相关功能集成，概念上偏向于 ci/cd。

## 2.功能

- 最新版本检测
- 提供部分项目从小程序环境切换到项目 release 的整套解决方案
- 支持通过第三方平台发布提审的项目，也支持且仅支持普通方式（即直接通过微信mp后台上传发布提审）的打包上传代码（即该方式不提供提审发布）
- 项目 release

## 3.如何安装使用

### 3.1.安装

yarn

```shell
npm i yrm -g
yrm add company http://npm.internal.focus.cn/
yrm use company
yarn global add @focus/mp-uni-cli
```

npm

```shell
npm config set registry http://npm.internal.focus.cn/
npm i @focus/mp-uni-cli -g
```

### 3.2.使用

- 需要 node 版本>=14.0.0
- 当前 cli 工具仅适用于 uni-app 开发的小程序
- `mp publish | mp p`：依据特定环境配置部署,支持开发、线上、staging 三种模式
- `mp release | mp r`：一键打 tag 以及推代码
- `mp config set [k] [v]`：设置本地cli某项配置
- `mp config get [k]`：获取本地cli某项配置
- `mp config remove [k]`：删除本地cli某项配置
- `mp config get -a`：获取本地cli全部配置
- `mp config remove -a`：删除本地cli配置

**注意：**
- 默认cli配置如下：
  
```js
  {  
    CHECK_VERSION_INTERVAL: 3600 * 1000 * 24, // 自动检查cli工具版本的周期（s）
    CLI_DIR: './mp-uni-cli', // 相对于使用方根目录的配置目录
    ASK_FOR_CLI: 'ask-for-cli.json', // 使用方cli配置文件名，约定为json形式
    UPLOAD_SECRET: 'private.xxx.key', // 上传代码密钥文件的文件名格式，appid用xxx代替
    REGISTRY: 'http://npm.internal.focus.cn', // npm源，用于检查cli版本
    MAIN_BRANCH: 'master' // 使用方项目默认主分支名，用于release、打tag
  }
```

- 上面提到的使用方的配置文件`ask-for-cli.json`和cli本身的配置文件是两个概念，`ask-for-cli.json`是服务于mp-uni-cli，提供小程序相关的信息，而cli本身的配置是便于mp-uni-cli管理小程序以及读取使用方的`ask-for-cli.json`文件，推荐使用默认设置，不用自定义
- `mp config remove`删除cli配置时是删除本地磁盘中缓存的配置，此外当全部删除后，读取配置是以运行内存中的缓存为准，即全部删除只是删了磁盘中的临时文件

## 4.使用方项目适配

为了使该 cli 正常运行，使用方的项目目录中需要做一些适配：(以[集团营销跟客助手](http://code.ops.focus.cn/sc/sc-group-agent-mp-uni/tree/master)为例,无权限请联系`覃俊逸`开通仓库权限)。

### 4.1.cli 配置文件

<img src="https://t.focus-res.cn/front-end/mp-uni-cli/md2.jpg" alt="example1" style="zoom:100%;" />

#### 4.1.1.第三方平台项目

项目根目录新增 mp-uni-cli 文件夹，包含`ask-for-cli.json`以及两个.key 的文件。

`ask-for-cli.json`：需要提供五个字段。

```json
{
  "APP_ID": {
​    "dev": "实际使用的开发小程序的appid",
​    "work": "实际使用的线上小程序的appid"
  },
  "EXT_APP_ID": {
​    "dev": "第三方平台dev绑定的开发小程序的appid",
​    "work": "第三方平台work绑定的开发小程序的appid"
  },
  "DIST_PATH": "打包后的相对路径，是build路径不是dev路径",
  "AUDIT_DESC": "提审时的额外信息",
  "MAIN_BRANCH": "项目主分支名"
}
```

两个.key 分别是第三方平台绑定的开发小程序的上传代码的密钥文件。因为该 cli 内部是使用[miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html) 来上传代码，而这个 npm 包需要对应的密钥文件。**此密钥文件是在“[微信公众平台](https://mp.weixin.qq.com/)-开发-开发设置-小程序代码上传”获取,同时也需要在 ip 白名单设置好当前使用该 cli 终端的 ip**。

<img src="https://t.focus-res.cn/front-end/mp-uni-cli/md3.png" alt="example3" style="zoom:67%;" />

#### 4.1.2.微信mp平台项目

```json
{
  "APP_ID": "实际使用的开发小程序的appid",
  "DIST_PATH": "打包后的相对路径，是build路径不是dev路径",
  "MAIN_BRANCH": "项目主分支名"
}
```

.key文件的获取方式同上方第三方平台项目，只是这种项目只有一个.key，即当前小程序上传代码的密钥

### 4.2.项目切换环境

#### 4.2.1.业务域名

<img src="https://t.focus-res.cn/front-end/mp-uni-cli/md1.jpg" alt="example1" style="zoom:80%;text-align:left" />

在项目根目录增加三个环境配置文件`.env,.env.development,.env.development.staging`分别对应线上、开发以及 staging 模式，其中开发和 staging 模式默认对应 dev 和 test，也是开发阶段中经常用到的。这种方式是采用了 vue-cli 提供的[模式切换](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)的能力，这也是为解决手动改代码切换环境做铺垫。文件中配置一个变量，变量名为 VUE_APP_BIZ_ENV（可按 vue-cli 约定的规范自定义后缀），开发、staging、线上分别赋值 dev、test、work（staging 为啥默认 test，下文会有说明）。在需求开发时可在`package.json`中增加个脚本,方便启用 staging 模式。

```json
dev:staging": "yarn dev:mp-weixin --mode development.staging"
```

这里需要注意的是采用开发和测试模式在 cli 中打包部署实质会将代码包上传=>草稿箱=>模版库到`ask-for-cli.json`配置的`EXT_APP_ID.dev`对应的第三方平台绑定的开发小程序，线上模式类似会推到 work 对应的第三方平台绑定的开发小程序。

在代码层面需要调整的是**在当前项目之前需要手动改代码切换环境的位置将环境变量值进行替换**，以集团营销跟客助手为例：

![example4](https://t.focus-res.cn/front-end/mp-uni-cli/md4.jpg)

env 作为运行时环境变量的载体可用来控制小程序业务域名的切换了。

#### 4.2.2.scss 环境变量切换

原理如下，因为 scss 的环境变量主要用来区分图片 cdn 的环境，且目前组内静态资源 cdn 只有测试和线上两个环境，因此新建两个 scss 文件`env.test.scss,env.work.scss`分别对应测试和线上环境，然后在 webpack 编译时根据不同的运行模式加载对应环境的 scss。

![example5](https://t.focus-res.cn/front-end/mp-uni-cli/md5.jpg)

在 vue.config.js 中调整相关配置

![example6](https://t.focus-res.cn/front-end/mp-uni-cli/md6.jpg)

ps:调研以及尝试了一些其他切换 scss 变量的方案，比如通过 sass-loader 的[additionaldata](https://github.com/webpack-contrib/sass-loader#additionaldata)在各个 scss 顶部插入环境常量、fs 修改环境变量等，但会存在一些打包体积过大、scss 导入依赖异常、格式化异常等问题，后采用这种比较笨的方式区分，若有更好的方案可以建个 issue 一起讨论

## 5.Q&A

1、.staging 为啥默认 test

其实也可不默认为 test，默认为 dev、work 都可以，这里只是将三个配置文件配置成认知上的开发、测试、线上环境。换一种说法其实 staging 模式可以理解为开发时需要配置的特殊环境，比如开发时想要看线上环境，就将 VUE_APP_BIZ_ENV 置为 work，然后运行 staging 模式，那么小程序业务域名以及 scss 环境变量都会变成线上的。

## 6.TODO

- [ ] cli 错误日志记录到本地磁盘，方便查看相关异常问题

- [ ] 代码优化。

  - [ ] 接口层简单用 axios 请求，响应体暂时返回原生结构体

- [x] rc 字典新建字段的功能设置成类似`npm config set`的命令，并暴露给使用者自定设置
