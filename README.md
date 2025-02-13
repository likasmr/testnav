# 二次元导航站

![preview](preview.png)

一个动漫风格的浏览器导航网站，支持深色/浅色主题切换。

## 功能特性
- 🎨 二次元风格设计
- 🌓 智能主题切换（支持系统级偏好）
- 💾 主题状态记忆
- 📱 响应式布局
- ✨ 卡片悬停动效

## 使用方式
1. 克隆仓库
2. 直接打开 `index.html` 或部署到静态托管服务

## 自定义配置
修改 `links` 数组添加你的常用链接：

```js
// 在 script.js 中添加类似结构
const links = [
{
title: "Bangumi",
url: "https://bgm.tv",
description: "番剧索引",
color: "#ff6b6b"
}
]
```

## 开源协议
MIT License
