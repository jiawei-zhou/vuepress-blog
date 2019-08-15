module.exports = {
  title: '朝风尘',
  description: '我有一壶酒，足以慰风尘',
  dest: 'dist',
  base: '/',
  head: [
    ['meta', { name: 'keywords', content: '前端，技术博客，js，node，react，vue，typescript' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    //增加manifest.json
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'apple-touch-icon', href: '/img/logo.png' }]
  ],
  theme: 'reco',
  themeConfig: {
    huawei: false,
    type: 'blog',
    nav: [
      { text: '首页', link: '/', icon: 'reco-home' },
      { text: 'TimeLine', link: '/timeLine/', icon: 'reco-date' },
      { text: '联系', 
        icon: 'reco-message',
        items: [
          { text: 'NPM', link: 'https://www.npmjs.com/~zhoujw', icon: 'reco-npm' },
          { text: 'GitHub', link: 'https://github.com/jiawei-zhou', icon: 'reco-github' },
          { text: 'CSDN', link: 'https://me.csdn.net/qq2027', icon: 'reco-csdn' },
          // { text: 'WeChat', link: 'https://github.com/jiawei-zhou', icon: 'reco-wechat' },
        ]
      }
    ],
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '前端技术' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    logo: '/head.png',
    // 搜索设置
    search: true,
    // searchMaxSuggestions: 10,
    sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    // author: 'jiawei.zhou',
    // 备案号
    // record: 'xxxx',
    // 项目开始时间
    // startYear: '2019'
    // 配置登录密钥 (if your blog is private)
    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },
    // 添加评论功能
    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  // markdown: {
    // lineNumbers: true
  // },
  plugins: ['@vuepress/medium-zoom', 'flowchart', 'vuepress-plugin-cat']
}  