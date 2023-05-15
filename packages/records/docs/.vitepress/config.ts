import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/technology',
  title: '首页',
  description: 'GrainFull的技术笔记',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      {
        text: '准备工作',
        items: [
          {
            text: 'mac',
            link: '/prepare/mac/index',
          },
          {
            text: 'windows',
            link: '/prepare/windows/index',
          },
        ],
      },
      {
        text: '前端',
        items: [
          {
            text: 'UI库',
            items: [
              {
                text: 'React',
                link: '/frontend/react/index.md',
              },
              {
                text: 'Vue',
                link: '/frontend/vue/index.md',
              },
            ],
          },
          {
            text: '多包管理monorepo',
            link: '/',
          },
          {
            text: '打包工具',
            link: '/',
          },
          {
            text: '持续集成ci',
            link: '/',
          },
        ],
      },
      {
        text: '后端',
        items: [
          { text: 'nodejs', link: '/' },
          {
            text: 'java',
            items: [{ text: 'nodejs', link: '/' }],
          },
        ],
      },
    ],
  },
  outDir: '../../../docs',
});
