import {defineConfig} from 'vitepress'

const isModStart = !!process.env.IS_MODSTART
const BASE_PATH = '/webuploader-plus/';
const CDN_URL = 'https://open-cdn.modstart.com/webuploader-plus/';

export default defineConfig({
    title: 'WebUploader Plus',
    description: '基于 WebUploader 的现代化文件上传组件',
    lang: 'zh-CN',
    base: isModStart ? BASE_PATH : '/',
    async transformHtml(code, id, {pageData}) {
        if (!isModStart) return

        // This regex matches two cases:
        // 1. /webuploader-plus/assets/... (paths with Base)
        // 2. /logo.svg (root path resources without Base)
        // Note: We exclude normal page navigation links
        const assetRegex = new RegExp(
            `(href|src)="(${BASE_PATH}|/)([^"]+\\.(?:css|js|woff2?|svg|png|jpg|jpeg|gif|ico))"`,
            'g'
        );

        return code.replace(assetRegex, (match, p1, p2, p3) => {
            // p1: href or src
            // p2: matched prefix (/webuploader-plus/ or /)
            // p3: filename and remaining path (logo.svg or assets/app.js)
            return `${p1}="${CDN_URL}${p3}"`;
        });
    },

    ignoreDeadLinks: true,

    head: [
        ...(isModStart ? [
            [
                'script',
                {},
                `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?f84f35a44b5cc5c0b10c3fabdf0f322b";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();`
            ]
        ] : []),
        ['link', {rel: 'icon', type: 'image/svg+xml', href: isModStart ? `${CDN_URL}logo.svg` : '/logo.svg'}],
        ['meta', {name: 'theme-color', content: '#646cff'}],
        ['meta', {property: 'og:type', content: 'website'}],
        ['meta', {property: 'og:locale', content: 'zh'}],
        ['meta', {property: 'og:title', content: 'WebUploader Plus | 现代化文件上传组件'}],
        ['meta', {property: 'og:site_name', content: 'WebUploader Plus'}],
    ],

    themeConfig: {
        logo: isModStart ? `${CDN_URL}logo.svg` : '/logo.svg',

        nav: [
            {text: '指南', link: '/guide/getting-started'},
            {
                text: '开源链接',
                items: [
                    {text: 'GitHub', link: 'https://github.com/modstart-lib/webuploader-plus'},
                    {text: 'Gitee', link: 'https://gitee.com/modstart-lib/webuploader-plus'},
                ]
            },
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '开始使用',
                    items: [
                        {text: '快速开始', link: '/guide/getting-started'},
                        {text: '安装', link: '/guide/installation'},
                    ]
                },
                {
                    text: '核心功能',
                    items: [
                        {text: '文件上传', link: '/guide/file-upload'},
                        {text: '分片上传', link: '/guide/chunk-upload'},
                    ]
                }
            ],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/modstart-lib/webuploader-plus'}
        ],

        footer: {
            message: 'Released under the BSD License.',
            copyright: 'Copyright © 2026-present'
        },

        search: {
            provider: 'local'
        },

        editLink: {
            pattern: 'https://github.com/modstart-lib/webuploader-plus/edit/main/doc/:path',
            text: '在 GitHub 上编辑此页'
        },

        lastUpdated: {
            text: '最后更新时间',
            formatOptions: {
                dateStyle: 'short',
                timeStyle: 'medium'
            }
        },

        docFooter: {
            prev: '上一页',
            next: '下一页'
        },

        outline: {
            label: '页面导航',
            level: [2, 3]
        },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
    }
})
