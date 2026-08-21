# Kimi 倒计时

> 个人桌面倒计时工具——用精确到秒的流逝感,对抗拖延

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

Kimi 倒计时是一款跨平台桌面倒计时应用:多事件管理、每秒刷新、窗口置顶、数据仅存本地。基于 Tauri 2 + React + TypeScript 构建,安装包小、内存占用低。

## 功能

| 功能       | 说明                                   |
| ---------- | -------------------------------------- |
| 多事件倒计时 | 添加、编辑、删除倒计时事件,支持备注与颜色标签,卡片式展示 |
| 秒级实时刷新 | 剩余时间每秒更新                        |
| 常用日期模板 | 新建事件时一键填充常用目标日期             |
| 提前提醒    | 为事件设置提前提醒时间                    |
| 窗口置顶    | 默认置顶显示,可随时取消;标题栏拖动调整位置   |
| 本地持久化  | 所有数据仅存储在本地,不上传任何服务器       |
| 备份导入导出 | JSON 格式导出备份与导入恢复               |

## 下载与构建

**Windows**:每次推送到 main 分支时 CI 自动构建 NSIS 安装包,可在仓库 [Actions](../../actions) 页的最新构建记录中下载(下载构建产物需登录 GitHub)。

**从源码构建**(需要 Node.js LTS 与 Rust 工具链):

```bash
npm install
npm run tauri dev    # 开发调试
npm run tauri build  # 打包安装程序
```

## 技术栈

Tauri 2 + React + TypeScript(Rust 后端)。

## 规划中

以下功能在产品规划内、尚未实现,详见 [design/design.md](design/design.md):

- 桌面悬浮窗形态(嵌入桌面、透明度与尺寸调节)
- 深色/浅色主题切换
- 开机自启动
- 正计时模式、番茄钟集成

## 状态

个人项目,当前版本 v0.2.2。

## 许可

[Apache License 2.0](LICENSE)
