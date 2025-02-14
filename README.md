# AnimeHome 🎏

二次元风格的个人导航站，专为ACG爱好者设计

## 功能特色
- 🎨 日系渐变色背景与圆润UI设计
- 📦 卡片式分类管理（追番平台/资源社区/同人创作等）
- 🔍 快捷搜索跳转功能
- 🦊 动态看板娘元素（需自行添加素材）
- 📱 响应式布局适配各种设备
- 🌸 每日推荐番剧/角色

## 技术栈
- 原生HTML5/CSS3（使用CSS变量实现主题切换）
- 纯JavaScript实现动态交互
- Cloudflare Pages部署

## 部署指南
1. Fork本仓库
2. 登录Cloudflare控制台
3. 选择Pages服务 -> 连接GitHub仓库
4. 选择分支后自动部署

## 自定义配置
1. 修改`config.js`中的配置：
   - defaultBackground：设置默认背景图片
   - categories：配置导航链接分类
2. 在`style.css`中调整颜色变量
3. 添加`mascot`目录放置看板娘素材 