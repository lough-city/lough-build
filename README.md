# @lough/build-cli

> This is a Build tool docked in lough.

## Feature

> `JavaScript` 开发中的代码打包构建及其功能自动化集成脚手架。

1. `lough-build init`: 自动化集成代码打包构建能力。
2. `lough-build`：支持以下类型项目打包构建：
   - `classLib`：类库项目
   - `componentLib`：组件库项目

## Install

```bash
npm i @lough/build-cli -g
```

or

```bash
yarn add @lough/build-cli -g
```

## Usage

我们来看看其有哪些命令：

```bash
> lough-build --help
Usage: index [options] [command]

Build.

Options:
  -V, --version  output the version number
  -h, --help     display help for command

Commands:
  init           init project build function.
```

`lough-build` 命令将会用于打包构建。

执行 `lough-build init` 即可运行我们的初始化程序。

## Plan

- [ ] 脚手架打包支持
- [ ] 生产项目开发及其打包支持
