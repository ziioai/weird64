import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/weird64/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://ziioai.github.io/weird64/',
  },
  head: [
    ['link', { rel: 'icon', href: '/weird64/favicon.svg' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/weird64/apple-touch-icon.png' },
    ],
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Weird64',
      description: 'Exact encoding for arbitrary-length bit sequences',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'Weird64',
      description: '用于任意长度比特序列的精确编码',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ziioai/weird64' },
    ],
    locales: {
      root: {
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Format', link: '/format' },
          { text: 'API', link: '/api/', target: '_self' },
        ],
        sidebar: [
          {
            text: 'Documentation',
            items: [
              { text: 'Getting started', link: '/guide/' },
              { text: 'Encoding format', link: '/format' },
              { text: 'TypeDoc API', link: '/api/', target: '_self' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/ziioai/weird64/edit/main/press/:path',
          text: 'Edit this page on GitHub',
        },
        lastUpdated: {
          text: 'Last updated',
        },
      },
      zh: {
        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: '编码格式', link: '/zh/format' },
          { text: 'API', link: '/api/', target: '_self' },
        ],
        sidebar: [
          {
            text: '文档',
            items: [
              { text: '快速开始', link: '/zh/guide/' },
              { text: '编码格式', link: '/zh/format' },
              { text: 'TypeDoc API', link: '/api/', target: '_self' },
            ],
          },
        ],
        editLink: {
          pattern: 'https://github.com/ziioai/weird64/edit/main/press/:path',
          text: '在 GitHub 上编辑此页',
        },
        lastUpdated: {
          text: '最后更新',
        },
        outline: {
          label: '页面导航',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
      },
    },
  },
});
