<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [@junyiqin/auto-release](#junyiqinauto-release)
  - [简介](#简介)
  - [功能](#功能)
  - [如何使用](#如何使用)
    - [安装](#安装)
    - [使用](#使用)
    - [参数](#参数)
# @junyiqin/auto-release

## 简介

在发布npm包或者一些符合npm规范的私有项目release时，需要手动键入一系列脚本来推送代码、标记git tag以及发布项目到npm或私有npm中，本工具做了这些动作的集成，是一个方便实用的轻量级release工具。

## 功能

- 提供符合npm规范的版本号，支持major,minor,patch,premajor,preminor,prepatch,prerelease七种类型release版本号可选
- 自动更新包版本号、changelog（依赖conventional-changelog）
- 支持可选是否发布前构建，若需要请在使用方项目package.json中提供build脚本
- 自动合并代码至主分支
- 自动标记git tag
- 支持可选是否发布至npm

## 如何使用

### 安装

npm:

`npm install @junyiqin/auto-release -D` 

yarn:

`yarn add @junyiqin/auto-release -D `

### 使用

```js
import release from '@junyiqin/auto-release';

const currentVersion = '1.2.3'
release({ currentVersion });

```
### 参数

| 属性 | 简介 | 是否必填 | 类型 | 默认值 |
| :--: | ---- |:------: | :--: | :----: |
| currentVersion | 使用方项目当前版本号，e.g:1.2.3 | 是 | string | - |
| npmRegistry    | npm源地址 | 否 | string | - |
| npmAuthToken   | npm login authtToken，可在.npmrc中查看获取 | 否 | string | - |
| mainBranch     | 使用方项目git主分支 | 否 | string | `master` |
| needPublish    | 是否需要发布至npmRegistry对应的npm中 | 否 | boolean | false |

**注意：**

- 若需要发布至npm，npmRegistry、npmAuthToken、needPublish必填，且needPublish为true
- 使用了authToken是避免输入账号密码登录npm
