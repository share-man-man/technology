import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/technology',
  title: '小满的技术文档',
  description: 'GrainFull的技术笔记',
  lang: 'zh-CN',
  themeConfig: {
    search: {
      provider: 'local',
    },
    sidebar: {
      '/prepare/': [
        {
          text: '准备工作',
          items: [
            { text: '前言', link: '/prepare/' },
            {
              text: '科学上网',
              link: '/prepare/vpn',
            },
            {
              text: '开发工具',
              link: '/prepare/tools',
            },
            {
              text: '环境搭建',
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
            {
              text: '常用配置',
              link: '/prepare/public-config',
            },
          ],
        },
      ],
    },
    nav: [
      {
        text: '准备工作',
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
            link: '/monorepo',
          },
          {
            text: '打包工具',
            link: '/build-tools',
          },
          {
            text: '持续集成ci',
            link: '/ci',
          },
        ],
      },
      {
        text: '后端',
        items: [
          { text: 'nodejs', link: '/nodejs' },
          {
            text: 'java',
            items: [{ text: 'spring', link: '/spring' }],
          },
        ],
      },
    ],
  },
  outDir: '../../../docs',
  lastUpdated: true,
});
