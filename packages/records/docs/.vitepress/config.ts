import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/technology',
  title: '首页',
  description: 'GrainFull的技术笔记',
  lang: 'zh-CN',
  themeConfig: {
    sidebar: {
      '/prepare/': [
        {
          text: '准备工作',
          link: '/prepare/',
          items: [
            {
              text: '科学上网',
              link: '/prepare/vpn',
            },
            {
              text: '开发工具',
              link: '/prepare/tools',
            },
            {
              text: '环境准备',
              link: '/prepare/windows',
              items: [
                {
                  text: 'windows篇',
                  link: '/prepare/windows',
                },
                {
                  text: 'mac篇',
                  link: '/prepare/mac',
                },
              ],
            },
          ],
        },
      ],
    },
    nav: [
      {
        text: '开始',
        link: '/prepare/',
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
