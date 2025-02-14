export const siteConfig = {
  title: "二次元导航站",
  description: "一个简约而精致的二次元风格导航网站",
  theme: {
    primary: "#FF69B4", // 粉色主题
    secondary: "#8A2BE2"
  },
  categories: [
    {
      name: "动漫追番",
      icon: "🎬",
      sites: [
        {
          name: "哔哩哔哩",
          url: "https://www.bilibili.com",
          description: "国内最大的二次元视频网站",
          icon: "https://www.bilibili.com/favicon.ico"
        },
        {
          name: "AcFun",
          url: "https://www.acfun.cn",
          description: "认真你就输啦",
          icon: "https://www.acfun.cn/favicon.ico"
        }
      ]
    },
    {
      name: "漫画阅读",
      icon: "📚",
      sites: [
        {
          name: "漫画柜",
          url: "https://www.manhuagui.com",
          description: "在线漫画阅读网站",
          icon: "https://www.manhuagui.com/favicon.ico"
        }
      ]
    }
  ]
} 